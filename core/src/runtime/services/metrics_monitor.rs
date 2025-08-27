use crate::imports::*;
use crate::runtime::services::Service;
use crate::runtime::RpcApi;
use std::collections::HashMap;
use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use tondi_metrics_core::{Metric, Metrics, MetricsSnapshot};

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

    pub async fn ingest_metrics_snapshot(&self, snapshot: Box<MetricsSnapshot>) -> Result<()> {
        // println!("[METRICS DEBUG] ingest_metrics_snapshot called with snapshot: {:?}", snapshot);
        let timestamp = snapshot.unixtime_millis;
        
        // 先处理 metrics_data，避免在 async 中持有锁
        {
            let mut metrics_data = self.metrics_data.lock().unwrap();
            
            // 处理每个metric - 使用正确的字段
            let metrics = [
                (Metric::NodeCpuUsage, snapshot.node_cpu_usage),
                (Metric::NodeResidentSetSizeBytes, snapshot.node_resident_set_size_bytes),
                (Metric::NodeFileHandlesCount, snapshot.node_file_handles),
                (Metric::NodeDiskIoReadBytes, snapshot.node_disk_io_read_bytes),
                (Metric::NodeDiskIoReadPerSec, snapshot.node_disk_io_read_per_sec),
                (Metric::NodeDiskIoWriteBytes, snapshot.node_disk_io_write_bytes),
                (Metric::NodeDiskIoWritePerSec, snapshot.node_disk_io_write_per_sec),
                (Metric::NodeTotalBytesRx, snapshot.node_total_bytes_rx),
                (Metric::NodeTotalBytesRxPerSecond, snapshot.node_total_bytes_rx_per_second),
                (Metric::NodeTotalBytesTx, snapshot.node_total_bytes_tx),
                (Metric::NodeTotalBytesTxPerSecond, snapshot.node_total_bytes_tx_per_second),
                (Metric::NodeActivePeers, snapshot.node_active_peers),
                (Metric::NodeBlocksSubmittedCount, snapshot.node_blocks_submitted_count),
                (Metric::NodeHeadersProcessedCount, snapshot.node_headers_processed_count),
                (Metric::NodeDependenciesProcessedCount, snapshot.node_dependencies_processed_count),
                (Metric::NodeBodiesProcessedCount, snapshot.node_bodies_processed_count),
                (Metric::NodeTransactionsProcessedCount, snapshot.node_transactions_processed_count),
                (Metric::NodeChainBlocksProcessedCount, snapshot.node_chain_blocks_processed_count),
                (Metric::NodeMassProcessedCount, snapshot.node_mass_processed_count),
                (Metric::NodeDatabaseBlocksCount, snapshot.node_database_blocks_count),
                (Metric::NodeDatabaseHeadersCount, snapshot.node_database_headers_count),
                (Metric::NetworkMempoolSize, snapshot.network_mempool_size),
                (Metric::NetworkTransactionsPerSecond, snapshot.network_transactions_per_second),
                (Metric::NetworkTipHashesCount, snapshot.network_tip_hashes_count),
                (Metric::NetworkDifficulty, snapshot.network_difficulty),
                (Metric::NetworkPastMedianTime, snapshot.network_past_median_time),
                (Metric::NetworkVirtualParentHashesCount, snapshot.network_virtual_parent_hashes_count),
                (Metric::NetworkVirtualDaaScore, snapshot.network_virtual_daa_score),
            ];
            
            for (metric, value) in &metrics {
                if value.is_finite() {
                    // println!("[METRICS] 处理metric - {}: {} (finite: {})", metric.as_str(), value, value.is_finite());
                    
                    // 特殊处理磁盘读取指标
                    if *metric == Metric::NodeDiskIoReadPerSec {
                        // println!("[METRICS] ⚠️  磁盘读取指标 {} 的值: {}", metric.as_str(), value);
                        if *value == 0.0 {
                            // 磁盘读取速度为0，可能是正常情况
                        }
                    }
                    
                    // 添加到metrics_data
                    if let Some(data_vec) = metrics_data.get_mut(metric) {
                        if data_vec.len() > MAX_METRICS_SAMPLES {
                            data_vec.drain(0..data_vec.len() - MAX_METRICS_SAMPLES);
                        }
                        data_vec.push(egui_plot::PlotPoint { x: timestamp, y: *value });
                    }
                }
            }
        } // 锁在这里释放
        
        // 发送事件到UI
        if let Err(_e) = self.application_events
            .sender
            .send(crate::events::Events::MempoolSize { mempool_size: snapshot.network_mempool_size as usize })
            .await
        {
            // println!("[METRICS] Failed to send MempoolSize event: {}", e);
        }
        
        if let Err(_e) = self.application_events
            .sender
            .send(crate::events::Events::Metrics { snapshot })
            .await
        {
            // println!("[METRICS] Failed to send Metrics event: {}", e);
        } else {
            // println!("[METRICS] Successfully sent Metrics event to UI");
        }

        self.samples_since_connection.fetch_add(1, Ordering::SeqCst);

        Ok(())
    }

    pub fn samples_since_connection(&self) -> usize {
        self.samples_since_connection.load(Ordering::SeqCst)
    }

}

#[async_trait]
impl Service for MetricsService {
    fn name(&self) -> &'static str {
        "metrics-service"
    }

    async fn attach_rpc(self: Arc<Self>, rpc_api: &Arc<dyn RpcApi>) -> Result<()> {
        // println!("[METRICS DEBUG] attach_rpc called");
        self.rpc_api.lock().unwrap().replace(rpc_api.clone());

        let this = self.clone();
        // println!("[METRICS DEBUG] Registering sink callback");
        self.metrics
            .register_sink(Arc::new(Box::new(move |snapshot: MetricsSnapshot| {
                // println!("[METRICS DEBUG] Sink callback triggered with snapshot: {:?}", snapshot);
                let this = this.clone();
                let snapshot = Box::new(snapshot);
                tokio::spawn(async move {
                    if let Err(_err) = this.ingest_metrics_snapshot(snapshot).await {
                        // println!("Error ingesting metrics snapshot: {}", err);
                    }
                });
                None
            })));

        self.reset_metrics_data()?;
        // println!("[METRICS DEBUG] Starting metrics task");
        
        // 启用 tondi_metrics_core::Metrics 的sink机制，实现被动更新
        match self.metrics.start_task().await {
            Ok(_) => {
                // println!("[METRICS DEBUG] Metrics task started successfully");
            }
            Err(_e) => {
                // println!("[METRICS DEBUG] Warning: tondi_metrics_core::Metrics start_task failed: {}", e);
            }
        }
        
        // println!("[METRICS DEBUG] Binding RPC API to metrics");
        // 绑定RPC API到tondi_metrics_core::Metrics，启用被动更新
        self.metrics.bind_rpc(Some(rpc_api.clone()));
        // println!("[METRICS DEBUG] RPC API bound successfully");
        
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
        // println!("[METRICS DEBUG] connect_rpc called");
        self.samples_since_connection.store(0, Ordering::SeqCst);

        if let Some(rpc_api) = self.rpc_api() {
            // println!("[METRICS DEBUG] RPC API available, getting system info");
            match rpc_api.get_system_info().await {
                Ok(_system_info) => {
                    // println!("[METRICS DEBUG] System info: version={}, system_id={:?}", version, system_id);
                }
                Err(_e) => {
                    // println!("[METRICS DEBUG] Failed to get system info");
                }
            }
        } else {
            // println!("[METRICS DEBUG] No RPC API available");
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
