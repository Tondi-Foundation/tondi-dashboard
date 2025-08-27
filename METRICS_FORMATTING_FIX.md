# CPU和Memory指标格式化问题修复

## 问题描述

在overview界面上，CPU和memory指标数据没有正常格式化，数值太小了没有正常显示。具体表现为：

1. **CPU使用率显示问题**：CPU使用率可能显示为0.12%而不是12%，这是因为从gRPC获取的数据可能是小数形式（0.12表示12%）
2. **内存大小显示问题**：内存大小以字节为单位显示，数值过大，没有转换为可读的KB/MB/GB格式
3. **磁盘I/O和网络指标**：同样存在单位转换问题

## 根本原因

1. **CPU使用率单位不一致**：tondi节点返回的CPU使用率可能是小数形式（0.12），但显示时没有正确转换为百分比
2. **指标格式化方法问题**：`metric.format(value, true, true)`方法没有正确处理小数值和单位转换
3. **缺少自定义格式化逻辑**：没有针对特定指标类型的专门格式化处理

## 修复方案

### 1. 在Overview模块中添加自定义格式化方法

在`core/src/modules/overview.rs`中添加了`format_metric_value`方法：

```rust
fn format_metric_value(&self, metric: &Metric, value: f64) -> String {
    match metric {
        Metric::NodeCpuUsage => {
            // CPU使用率：确保显示为百分比，处理可能的小数形式
            let cpu_percent = if value <= 1.0 && value > 0.0 {
                // 如果是小数形式（如0.12），转换为百分比
                value * 100.0
            } else {
                value
            };
            
            if cpu_percent < 0.1 {
                format!("{:.3}%", cpu_percent)
            } else if cpu_percent < 1.0 {
                format!("{:.2}%", cpu_percent)
            } else {
                format!("{:.1}%", cpu_percent)
            }
        },
        Metric::NodeResidentSetSizeBytes | Metric::NodeVirtualMemorySizeBytes => {
            // 内存大小：转换为可读的KB/MB/GB格式
            if value < 1024.0 {
                format!("{:.0} B", value)
            } else if value < 1024.0 * 1024.0 {
                format!("{:.1} KB", value / 1024.0)
            } else if value < 1024.0 * 1024.0 * 1024.0 {
                format!("{:.1} MB", value / (1024.0 * 1024.0))
            } else {
                format!("{:.2} GB", value / (1024.0 * 1024.0 * 1024.0))
            }
        },
        // ... 其他指标的处理
        _ => {
            // 其他指标使用默认格式化
            metric.format(value, true, true)
        }
    }
}
```

### 2. 在Metrics模块中添加相同的格式化方法

在`core/src/modules/metrics.rs`中添加了相同的`format_metric_value`方法，确保详细图表也使用正确的格式化。

### 3. 更新所有格式化调用

将原来的：
```rust
metric.format(value, true, true)
```

替换为：
```rust
self.format_metric_value(&metric, value)
```

### 4. 修复图表轴标签和提示信息

更新了y轴格式化器、标签格式化器和坐标格式化器，确保CPU使用率在图表中也正确显示为百分比。

## 修复的具体指标类型

1. **CPU使用率** (`Metric::NodeCpuUsage`)
   - 检测小数形式（≤1.0）并转换为百分比
   - 根据数值大小调整精度（0.001%, 0.01%, 0.1%）

2. **内存大小** (`Metric::NodeResidentSetSizeBytes`, `Metric::NodeVirtualMemorySizeBytes`)
   - 自动转换为B/KB/MB/GB格式
   - 根据数值大小选择合适的单位

3. **磁盘I/O指标**
   - 总字节数：转换为B/KB/MB/GB
   - 速度指标：转换为B/s/KB/s/MB/s/GB/s

4. **网络指标**
   - 总字节数：转换为B/KB/MB/GB
   - 速度指标：转换为B/s/KB/s/MB/s/GB/s

## 测试建议

1. **CPU使用率测试**：运行一些程序来增加CPU使用率，验证显示是否正确
2. **内存使用测试**：检查内存大小是否正确显示为KB/MB/GB
3. **磁盘I/O测试**：进行文件操作，验证I/O指标的单位转换
4. **网络测试**：检查网络传输指标的单位转换

## 注意事项

1. 修复后的代码保持了向后兼容性，对于未明确处理的指标类型仍使用默认格式化
2. CPU使用率的转换逻辑假设：≤1.0的值为小数形式，>1.0的值为百分比形式
3. 内存和I/O指标使用1024作为转换基数（二进制前缀）
4. 所有格式化都考虑了数值精度，避免显示过多或过少的小数位

## 相关文件

- `core/src/modules/overview.rs` - Overview模块的格式化修复
- `core/src/modules/metrics.rs` - Metrics模块的格式化修复
- `core/src/runtime/services/metrics_monitor.rs` - 指标数据处理的调试信息
- `core/src/runtime/services/tondi/grpc_client.rs` - gRPC客户端的CPU单位分析
