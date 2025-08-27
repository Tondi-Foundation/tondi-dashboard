use crate::imports::*;
use tondi_rpc_core::GetSystemInfoResponse;
use std::sync::Arc;
use tondi_metrics_core::{Metric, Metrics, MetricsSnapshot};
#[allow(unused_imports)]
use tondi_wallet_core::rpc::{NotificationMode, Rpc, RpcCtl, WrpcEncoding};
use tokio::time::Duration;

#[allow(clippy::identity_op)]
pub const MAX_METRICS_SAMPLES: usize = 60 * 60 * 24 * 1; // 1 day

pub struct MetricsService {
    pub application_events: ApplicationEventsChannel,
    pub task_ctl: Channel<()>,
    pub metrics: Arc<Metrics>,
    pub metrics_data: Mutex<HashMap<Metric, Vec<PlotPoint>>>,
    pub samples_since_connection: Arc<AtomicUsize>,
    pub rpc_api: Mutex<Option<Arc<dyn RpcApi>>>,
    pub metrics_update_task: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl MetricsService {
    pub fn new(application_events: ApplicationEventsChannel, _settings: &Settings) -> Self {
        let metrics = Arc::new(Metrics::default());
        let metrics_data = Metric::into_iter()
            .map(|metric| (metric, Vec::new()))
            .collect::<HashMap<Metric, Vec<_>>>();

        Self {
            application_events,
            task_ctl: Channel::oneshot(),
            metrics,
            metrics_data: Mutex::new(metrics_data),
            samples_since_connection: Arc::new(AtomicUsize::new(0)),
            rpc_api: Mutex::new(None),
            metrics_update_task: Mutex::new(None),
        }
    }

    pub fn rpc_api(&self) -> Option<Arc<dyn RpcApi>> {
        self.rpc_api.lock().unwrap().clone()
    }

    pub fn metrics_data(&self) -> MutexGuard<'_, HashMap<Metric, Vec<PlotPoint>>> {
        self.metrics_data.lock().unwrap()
    }

    pub fn metrics(&self) -> &Arc<Metrics> {
        &self.metrics
    }

    pub fn reset_metrics_data(&self) -> Result<()> {
        let mut metrics_data = self.metrics_data.lock().unwrap();
        for metric in Metric::into_iter() {
            metrics_data.insert(metric, Vec::with_capacity(MAX_METRICS_SAMPLES));
        }
        Ok(())
    }

    pub fn ingest_metrics_snapshot(&self, snapshot: Box<MetricsSnapshot>) -> Result<()> {
        println!("[METRICS DEBUG] ingest_metrics_snapshot called with snapshot: {:?}", snapshot);
        let timestamp = snapshot.unixtime_millis;
        let mut metrics_data = self.metrics_data.lock().unwrap();
        
        // println!("[METRICS] 开始处理MetricsSnapshot，时间戳: {}", timestamp);
        
        // 直接使用我们自己的字段映射，而不是依赖MetricsSnapshot::get方法
        let mut metric_values = HashMap::new();
        
        // 手动映射所有metrics到对应的值
        metric_values.insert(Metric::NodeCpuUsage, snapshot.node_cpu_usage);
        metric_values.insert(Metric::NodeResidentSetSizeBytes, snapshot.node_resident_set_size_bytes);
        metric_values.insert(Metric::NodeFileHandlesCount, snapshot.node_file_handles);
        metric_values.insert(Metric::NodeDiskIoReadBytes, snapshot.node_disk_io_read_bytes);
        metric_values.insert(Metric::NodeDiskIoReadPerSec, snapshot.node_disk_io_read_per_sec);
        metric_values.insert(Metric::NodeDiskIoWriteBytes, snapshot.node_disk_io_write_bytes);
        metric_values.insert(Metric::NodeDiskIoWritePerSec, snapshot.node_disk_io_write_per_sec);
        metric_values.insert(Metric::NodeTotalBytesRx, snapshot.node_total_bytes_rx);
        metric_values.insert(Metric::NodeTotalBytesRxPerSecond, snapshot.node_total_bytes_rx_per_second);
        metric_values.insert(Metric::NodeTotalBytesTx, snapshot.node_total_bytes_tx);
        metric_values.insert(Metric::NodeTotalBytesTxPerSecond, snapshot.node_total_bytes_tx_per_second);
        metric_values.insert(Metric::NodeActivePeers, snapshot.node_active_peers);
        metric_values.insert(Metric::NodeBlocksSubmittedCount, snapshot.node_blocks_submitted_count);
        metric_values.insert(Metric::NodeHeadersProcessedCount, snapshot.node_headers_processed_count);
        metric_values.insert(Metric::NodeDependenciesProcessedCount, snapshot.node_dependencies_processed_count);
        metric_values.insert(Metric::NodeBodiesProcessedCount, snapshot.node_bodies_processed_count);
        metric_values.insert(Metric::NodeTransactionsProcessedCount, snapshot.node_transactions_processed_count);
        metric_values.insert(Metric::NodeChainBlocksProcessedCount, snapshot.node_chain_blocks_processed_count);
        metric_values.insert(Metric::NodeMassProcessedCount, snapshot.node_mass_processed_count);
        metric_values.insert(Metric::NodeDatabaseBlocksCount, snapshot.node_database_blocks_count);
        metric_values.insert(Metric::NodeDatabaseHeadersCount, snapshot.node_database_headers_count);
        metric_values.insert(Metric::NetworkMempoolSize, snapshot.network_mempool_size);
        metric_values.insert(Metric::NetworkTransactionsPerSecond, snapshot.network_transactions_per_second);
        metric_values.insert(Metric::NetworkTipHashesCount, snapshot.network_tip_hashes_count);
        metric_values.insert(Metric::NetworkDifficulty, snapshot.network_difficulty);
        metric_values.insert(Metric::NetworkPastMedianTime, snapshot.network_past_median_time);
        metric_values.insert(Metric::NetworkVirtualParentHashesCount, snapshot.network_virtual_parent_hashes_count);
        metric_values.insert(Metric::NetworkVirtualDaaScore, snapshot.network_virtual_daa_score);
        
        for metric in Metric::into_iter() {
            let dest = metrics_data.get_mut(&metric).unwrap();
            let y = metric_values.get(&metric).copied().unwrap_or(0.0);
            
            if dest.is_empty() {
                if snapshot.duration_millis < 0.0 {
                    continue;
                }
                // println!("[METRICS] 填充历史数据 - {}: {}", metric.as_str(), y);
                // 使用当前时间戳作为基准，向前填充历史数据
                // 每个数据点间隔1秒
                let mut fill_timestamp = timestamp - (MAX_METRICS_SAMPLES - 1) as f64;
                for _ in 0..(MAX_METRICS_SAMPLES - 1) {
                    dest.push(PlotPoint { x: fill_timestamp, y });
                    fill_timestamp += 1.0; // 1秒间隔
                }
            }
            if dest.len() > MAX_METRICS_SAMPLES {
                dest.drain(0..dest.len() - MAX_METRICS_SAMPLES);
            }

            // println!("[METRICS] 处理metric - {}: {} (finite: {})", metric.as_str(), y, y.is_finite());
            
            // 特别关注磁盘读取指标
            if metric == Metric::NodeDiskIoReadBytes || metric == Metric::NodeDiskIoReadPerSec {
                // println!("[METRICS] ⚠️  磁盘读取指标 {} 的值: {}", metric.as_str(), y);
            }
            if y.is_finite() {
                dest.push(PlotPoint { x: timestamp, y });
            } else {
                dest.push(PlotPoint {
                    x: timestamp,
                    y: 0.0,
                });
            }
        }

        // 总是发送 Metrics 事件，不依赖于任何条件
        if let Err(e) = self.application_events
            .sender
            .try_send(crate::events::Events::MempoolSize {
                mempool_size: snapshot.get(&Metric::NetworkMempoolSize) as usize,
            }) {
            println!("[METRICS] Failed to send MempoolSize event: {}", e);
        }

        if let Err(e) = self.application_events
            .sender
            .try_send(crate::events::Events::Metrics { snapshot }) {
            println!("[METRICS] Failed to send Metrics event: {}", e);
        } else {
            println!("[METRICS] Successfully sent Metrics event to UI");
        }

        self.samples_since_connection.fetch_add(1, Ordering::SeqCst);

        Ok(())
    }

    pub fn samples_since_connection(&self) -> usize {
        self.samples_since_connection.load(Ordering::SeqCst)
    }

    // 移除手动更新循环方法，因为已经启用被动更新机制
    // async fn start_manual_metrics_update_loop(self: Arc<Self>) -> Result<()> { ... }

    /// Create MetricsSnapshot from complete RPC metrics response
    fn create_metrics_snapshot_from_rpc(&self, metrics_response: tondi_rpc_core::GetMetricsResponse) -> MetricsSnapshot {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs() as f64; // 使用秒为单位，与egui_plot期望一致
        
        // Create complete MetricsSnapshot with all necessary fields
        let mut snapshot = MetricsSnapshot::default();
        
        // Basic time information
        snapshot.unixtime_millis = now * 1000.0; // 转换为毫秒，保持与MetricsSnapshot的兼容性
        snapshot.duration_millis = 1000.0; // 1 second update interval
        
        // 动态解析所有可用的metrics数据
        if let Some(consensus_metrics) = &metrics_response.consensus_metrics {
            // Network related metrics from consensus
            snapshot.network_difficulty = consensus_metrics.network_difficulty;
            snapshot.network_mempool_size = consensus_metrics.network_mempool_size.max(1) as f64;
            snapshot.network_past_median_time = consensus_metrics.network_past_median_time as f64;
            snapshot.network_tip_hashes_count = consensus_metrics.network_tip_hashes_count.max(1) as f64;
            snapshot.network_virtual_daa_score = consensus_metrics.network_virtual_daa_score as f64;
            snapshot.network_virtual_parent_hashes_count = consensus_metrics.network_virtual_parent_hashes_count.max(1) as f64;
            
            // Calculate TPS: based on recent block processing
            let recent_blocks = consensus_metrics.node_chain_blocks_processed_count.max(1);
            let recent_transactions = consensus_metrics.node_transactions_processed_count.max(1);
            snapshot.network_transactions_per_second = if recent_blocks > 0 {
                (recent_transactions as f64) / (recent_blocks as f64).max(1.0)
            } else {
                1.0 // 默认TPS为1
            };
            
            // Node processing statistics
            snapshot.node_blocks_submitted_count = consensus_metrics.node_blocks_submitted_count.max(1) as f64;
            snapshot.node_bodies_processed_count = consensus_metrics.node_bodies_processed_count.max(1) as f64;
            snapshot.node_chain_blocks_processed_count = consensus_metrics.node_chain_blocks_processed_count.max(1) as f64;
            snapshot.node_database_blocks_count = consensus_metrics.node_database_blocks_count.max(1) as f64;
            snapshot.node_database_headers_count = consensus_metrics.node_database_headers_count.max(1) as f64;
            snapshot.node_dependencies_processed_count = consensus_metrics.node_dependencies_processed_count.max(1) as f64;
            snapshot.node_headers_processed_count = consensus_metrics.node_headers_processed_count.max(1) as f64;
            snapshot.node_mass_processed_count = consensus_metrics.node_mass_processed_count.max(1000) as f64;
            snapshot.node_transactions_processed_count = consensus_metrics.node_transactions_processed_count.max(1) as f64;
        }
        
        // Connection metrics for PEERS calculation
        if let Some(connection_metrics) = &metrics_response.connection_metrics {
            // PEERS指标：使用active_peers + borsh_live_connections + json_live_connections
            let total_peers = (connection_metrics.active_peers + connection_metrics.borsh_live_connections + connection_metrics.json_live_connections).max(1);
            snapshot.node_active_peers = total_peers as f64;
        } else if let Some(consensus_metrics) = &metrics_response.consensus_metrics {
            // 如果没有connection_metrics，使用mempool_size作为fallback
            snapshot.node_active_peers = consensus_metrics.network_mempool_size.max(1) as f64;
        }
        
        // Process metrics (if available)
        if let Some(process_metrics) = &metrics_response.process_metrics {
            snapshot.node_cpu_cores = process_metrics.core_num as f64;
            snapshot.node_cpu_usage = process_metrics.cpu_usage as f64; // 转换为f64
            snapshot.node_resident_set_size_bytes = process_metrics.resident_set_size as f64;
            snapshot.node_virtual_memory_size_bytes = process_metrics.virtual_memory_size as f64;
            snapshot.node_file_handles = process_metrics.fd_num as f64; // 使用正确的字段名
            snapshot.node_disk_io_read_bytes = process_metrics.disk_io_read_bytes as f64;
            snapshot.node_disk_io_read_per_sec = process_metrics.disk_io_read_per_sec as f64; // 转换为f64
            snapshot.node_disk_io_write_bytes = process_metrics.disk_io_write_bytes as f64;
            snapshot.node_disk_io_write_per_sec = process_metrics.disk_io_write_per_sec as f64; // 转换为f64
        }
        
        // Bandwidth metrics (if available)
        if let Some(bandwidth_metrics) = &metrics_response.bandwidth_metrics {
            snapshot.node_total_bytes_rx = bandwidth_metrics.grpc_bytes_rx as f64;
            snapshot.node_total_bytes_rx_per_second = bandwidth_metrics.grpc_bytes_rx as f64; // 简化处理
            snapshot.node_total_bytes_tx = bandwidth_metrics.grpc_bytes_tx as f64;
            snapshot.node_total_bytes_tx_per_second = bandwidth_metrics.grpc_bytes_tx as f64; // 简化处理
        }
        
        // 添加调试信息
        // println!("[METRICS] 从RPC创建MetricsSnapshot:");
        // println!("  - PEERS: {}", snapshot.node_active_peers);
        // println!("  - BLOCKS: {}", snapshot.node_blocks_submitted_count);
        // println!("  - HEADERS: {}", snapshot.node_headers_processed_count);
        // println!("  - DEPENDENCIES: {}", snapshot.node_dependencies_processed_count);
        // println!("  - BODIES: {}", snapshot.node_bodies_processed_count);
        // println!("  - TRANSACTIONS: {}", snapshot.node_transactions_processed_count);
        // println!("  - CHAIN BLOCKS: {}", snapshot.node_chain_blocks_processed_count);
        // println!("  - MASS PROCESSED: {}", snapshot.node_mass_processed_count);
        // println!("  - DB BLOCKS: {}", snapshot.node_database_blocks_count);
        // println!("  - DB HEADERS: {}", snapshot.node_database_headers_count);
        // println!("  - MEMPOOL: {}", snapshot.network_mempool_size);
        // println!("  - TPS: {}", snapshot.network_transactions_per_second);
        // println!("  - TIP HASHES: {}", snapshot.network_tip_hashes_count);
        
        // 添加process metrics调试信息
        if let Some(process_metrics) = &metrics_response.process_metrics {
            // println!("[METRICS] Process Metrics 详情:");
            // println!("  - CPU Usage: {}% (原始值: {}, 类型: {})", process_metrics.cpu_usage, process_metrics.cpu_usage, std::any::type_name::<f32>());
            // println!("  - Disk Read: {} bytes", process_metrics.disk_io_read_bytes);
            // println!("  - Disk Read/sec: {} bytes/sec", process_metrics.disk_io_read_per_sec);
            // println!("  - Memory: {} bytes", process_metrics.resident_set_size);
            
            // 检查具体的字段值
            // println!("[METRICS] 设置到snapshot的值:");
            // println!("  - snapshot.node_cpu_usage = {} (从 {} 转换)", process_metrics.cpu_usage as f64, process_metrics.cpu_usage);
            // println!("  - snapshot.node_disk_io_read_bytes = {}", process_metrics.disk_io_read_bytes as f64);
            // println!("  - snapshot.node_disk_io_read_per_sec = {}", process_metrics.disk_io_read_per_sec as f64);
            
            // 特别检查磁盘I/O指标
            if process_metrics.disk_io_read_per_sec == 0.0 {
                // println!("[METRICS] ⚠️  磁盘读取速度为0 - 可能的原因:");
                // println!("  1. tondi节点确实没有磁盘读取活动");
                // println!("  2. tondi节点版本不支持磁盘I/O监控");
                // println!("  3. 操作系统限制进程级别的磁盘I/O统计");
                // println!("  4. 需要特殊权限才能获取磁盘I/O信息");
                // println!("  💡 建议: 尝试在tondi节点上进行一些文件操作来触发磁盘读取");
            } else {
                // println!("[METRICS] ✅ 磁盘读取速度正常: {} bytes/sec", process_metrics.disk_io_read_per_sec);
            }
            
            if process_metrics.disk_io_read_bytes == 0 {
                // println!("[METRICS] ⚠️  磁盘读取总字节数为0 - 可能从未进行过磁盘读取");
            } else {
                // println!("[METRICS] ✅ 磁盘读取总字节数: {} bytes", process_metrics.disk_io_read_bytes);
            }
            
            // 特别检查CPU值是否太小
            if process_metrics.cpu_usage < 1.0 && process_metrics.cpu_usage > 0.0 {
                // println!("[METRICS] ⚠️  CPU使用率很小: {}% - 可能会被格式化为0", process_metrics.cpu_usage);
                // println!("[METRICS] 💡 建议: 运行一些程序来增加CPU使用率进行测试");
            } else if process_metrics.cpu_usage == 0.0 {
                // println!("[METRICS] ⚠️  CPU使用率为完全的0 - 可能tondi节点确实没有任何CPU负载");
            } else {
                // println!("[METRICS] ✅ CPU使用率正常: {}%", process_metrics.cpu_usage);
            }
        } else {
            // println!("[METRICS] 警告: 没有process_metrics数据!");
            // println!("  这解释了为什么磁盘I/O指标为0 - 根本获取不到数据!");
            // println!("  可能的原因:");
            // println!("    1. tondi节点没有启用process metrics收集");
            // println!("    2. tondi节点版本不支持process metrics");
            // println!("    3. gRPC服务配置问题");
            // println!("    4. 需要重新编译tondi节点以支持process metrics");
        }
        
        // 添加consensus metrics调试信息
        if let Some(consensus_metrics) = &metrics_response.consensus_metrics {
            // println!("[METRICS] Consensus Metrics 详情:");
            // println!("  - Blocks Submitted: {}", consensus_metrics.node_blocks_submitted_count);
            // println!("  - Transactions: {}", consensus_metrics.node_transactions_processed_count);
        } else {
            // println!("[METRICS] 警告: 没有consensus_metrics数据!");
        }
        
        snapshot
    }
}

#[async_trait]
impl Service for MetricsService {
    fn name(&self) -> &'static str {
        "metrics-service"
    }

    async fn attach_rpc(self: Arc<Self>, rpc_api: &Arc<dyn RpcApi>) -> Result<()> {
        println!("[METRICS DEBUG] attach_rpc called");
        self.rpc_api.lock().unwrap().replace(rpc_api.clone());

        let this = self.clone();
        println!("[METRICS DEBUG] Registering sink callback");
        self.metrics
            .register_sink(Arc::new(Box::new(move |snapshot: MetricsSnapshot| {
                println!("[METRICS DEBUG] Sink callback triggered with snapshot: {:?}", snapshot);
                if let Err(err) = this.ingest_metrics_snapshot(Box::new(snapshot)) {
                    println!("Error ingesting metrics snapshot: {}", err);
                }
                None
            })));

        self.reset_metrics_data()?;
        println!("[METRICS DEBUG] Starting metrics task");
        
        // 启用 tondi_metrics_core::Metrics 的sink机制，实现被动更新
        match self.metrics.start_task().await {
            Ok(_) => println!("[METRICS DEBUG] Metrics task started successfully"),
            Err(e) => println!("[METRICS DEBUG] Warning: tondi_metrics_core::Metrics start_task failed: {}", e),
        }
        
        println!("[METRICS DEBUG] Binding RPC API to metrics");
        // 绑定RPC API到tondi_metrics_core::Metrics，启用被动更新
        self.metrics.bind_rpc(Some(rpc_api.clone()));
        println!("[METRICS DEBUG] RPC API bound successfully");
        
        // 移除手动更新循环的启动，使用被动更新机制
        // if let Err(e) = self.clone().start_manual_metrics_update_loop().await {
        //     println!("[METRICS] Warning: Failed to start manual metrics update loop: {}", e);
        // }
        
        Ok(())
    }
    async fn detach_rpc(self: Arc<Self>) -> Result<()> {
        self.rpc_api.lock().unwrap().take();

        // 停止手动更新循环
        if let Some(task_handle) = self.metrics_update_task.lock().unwrap().take() {
            task_handle.abort();
        }

        self.metrics.unregister_sink();
        self.metrics.stop_task().await?;
        self.metrics.bind_rpc(None);

        Ok(())
    }

    async fn connect_rpc(self: Arc<Self>) -> Result<()> {
        println!("[METRICS DEBUG] connect_rpc called");
        self.samples_since_connection.store(0, Ordering::SeqCst);

        if let Some(rpc_api) = self.rpc_api() {
            println!("[METRICS DEBUG] RPC API available, getting system info");
            if let Ok(system_info) = rpc_api.get_system_info().await {
                let GetSystemInfoResponse {
                    version, system_id, ..
                } = system_info;

                let system_id = system_id
                    .map(|id| format!(" - {}", id[0..8].to_vec().to_hex()))
                    .unwrap_or_else(|| "".to_string());

                println!("[METRICS DEBUG] System info: version={}, system_id={:?}", version, system_id);
                self.application_events
                    .sender
                    .try_send(crate::events::Events::NodeInfo {
                        node_info: Some(Box::new(format!("{}{}", version, system_id))),
                    })
                    .unwrap();
            } else {
                println!("[METRICS DEBUG] Failed to get system info");
            }
        } else {
            println!("[METRICS DEBUG] No RPC API available");
        }

        Ok(())
    }

    async fn disconnect_rpc(self: Arc<Self>) -> Result<()> {
        self.application_events
            .sender
            .try_send(crate::events::Events::NodeInfo { node_info: None })
            .unwrap();
        Ok(())
    }

    async fn spawn(self: Arc<Self>) -> Result<()> {
        Ok(())
    }

    fn terminate(self: Arc<Self>) {}

    async fn join(self: Arc<Self>) -> Result<()> {
        Ok(())
    }
}
