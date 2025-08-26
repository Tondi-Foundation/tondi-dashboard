use crate::imports::*;

pub mod blockdag_monitor;
pub use blockdag_monitor::BlockDagMonitorService;

pub mod feerate_monitor;
pub use feerate_monitor::FeerateMonitorService;

pub mod market_monitor;
pub use market_monitor::MarketMonitorService;

pub mod update_monitor;
pub use update_monitor::UpdateMonitorService;

pub mod metrics_monitor;
pub use metrics_monitor::MetricsService;

pub mod peer_monitor;
pub use peer_monitor::PeerMonitorService;

pub mod repaint_service;
pub use repaint_service::RepaintService;

pub mod tondi;
pub use tondi::TondiService;

/// Service is a core component of the Tondi Dashboard application responsible for
/// running application services and communication between these services.
#[async_trait]
pub trait Service: Sync + Send + DowncastSync {
    fn name(&self) -> &'static str;

    /// Start the service
    async fn spawn(self: Arc<Self>) -> Result<()>;

    /// Signal the service termination (post a shutdown request)
    fn terminate(self: Arc<Self>);

    /// Block until the service is terminated
    async fn join(self: Arc<Self>) -> Result<()>;

    /// Called when Tondi RPC API has been created (but node is not
    /// connected yet, see [`connect_rpc`](Service::connect_rpc))
    /// for connectivity signalling.
    async fn attach_rpc(self: Arc<Self>, _rpc_api: &Arc<dyn RpcApi>) -> Result<()> {
        Ok(())
    }
    /// Called when Tondi RPC API is no longer available
    async fn detach_rpc(self: Arc<Self>) -> Result<()> {
        Ok(())
    }

    /// Called when Tondi RPC API has successfully connected
    async fn connect_rpc(self: Arc<Self>) -> Result<()> {
        Ok(())
    }

    /// Called when Tondi RPC API has disconnected
    async fn disconnect_rpc(self: Arc<Self>) -> Result<()> {
        Ok(())
    }
}

// 为Service trait实现DowncastSync
impl_downcast!(Service);
