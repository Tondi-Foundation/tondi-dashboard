use crate::imports::*;

#[derive(Clone, Default)]
pub enum DeleteState {
    #[default]
    Idle,
    Confirm { wallet_descriptor: WalletDescriptor },
    Deleting { wallet_descriptor: WalletDescriptor },
    Completed,
    Error { error: Arc<Error> },
}

pub struct WalletDelete {
    pub state: DeleteState,
    pub confirm_text: String,
}

impl WalletDelete {
    pub fn new(_runtime: Runtime) -> Self {
        Self {
            state: DeleteState::Idle,
            confirm_text: String::new(),
        }
    }

    pub fn confirm_delete(&mut self, wallet_descriptor: WalletDescriptor) {
        self.state = DeleteState::Confirm { wallet_descriptor };
        self.confirm_text.clear();
    }

    pub fn cancel_delete(&mut self) {
        self.state = DeleteState::Idle;
        self.confirm_text.clear();
    }

    pub fn execute_delete(&mut self, core: &mut Core, ui: &mut Ui) {
        if let DeleteState::Confirm { wallet_descriptor } = &self.state {
            let wallet_descriptor = wallet_descriptor.clone();
            
            // 切换到删除状态
            self.state = DeleteState::Deleting { wallet_descriptor: wallet_descriptor.clone() };
            
            // 直接在当前上下文中执行删除操作
            if let Err(e) = self.delete_wallet_sync(core, &wallet_descriptor) {
                self.state = DeleteState::Error { error: Arc::new(e) };
            } else {
                // 删除成功后显示完成页面，让用户点击OK返回
                self.state = DeleteState::Completed;
                // 强制刷新UI
                ui.ctx().request_repaint();
            }
        }
    }

    fn delete_wallet_sync(&self, core: &mut Core, wallet_descriptor: &WalletDescriptor) -> Result<()> {
        // 检查是否是当前打开的钱包
        let is_current_wallet = if let Some(current) = &core.wallet_descriptor {
            current.filename == wallet_descriptor.filename
        } else {
            false
        };

        // 如果删除的是当前钱包，先关闭它
        if is_current_wallet {
            // 发送关闭钱包事件
            // 注意：这里需要异步处理，暂时跳过
            // core.runtime.send(Events::Close).await?;
        }

        // 删除钱包文件
        self.delete_wallet_file_sync(core, wallet_descriptor)?;

        // 从内存中的钱包列表中移除
        core.wallet_list.retain(|w| w.filename != wallet_descriptor.filename);

        // 更新钱包列表
        core.wallet_update_list();

        // 强制刷新UI - 通过其他方式实现
        // core.runtime.request_repaint(); // 私有字段，无法访问

        Ok(())
    }

    fn delete_wallet_file_sync(&self, _core: &mut Core, wallet_descriptor: &WalletDescriptor) -> Result<()> {
        // 获取钱包存储路径 - 钱包文件存储在 ~/.tondi/ 目录下
        let home_dir = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        let tondi_dir = std::path::Path::new(&home_dir).join(".tondi");
        
        let wallet_name = &wallet_descriptor.filename;
        
        // 需要删除的文件和文件夹
        let wallet_file = tondi_dir.join(format!("{}.wallet", wallet_name));
        let transactions_dir = tondi_dir.join(format!("{}.transactions", wallet_name));

        // 添加调试信息
        println!("尝试删除钱包: {}", wallet_name);
        println!("钱包文件路径: {:?}", wallet_file);
        println!("交易文件夹路径: {:?}", transactions_dir);
        println!("Tondi目录: {:?}", tondi_dir);

        // 删除钱包文件
        if wallet_file.exists() {
            println!("钱包文件存在，正在删除...");
            if let Err(e) = std::fs::remove_file(&wallet_file) {
                println!("删除钱包文件失败: {}", e);
                return Err(Error::Custom(format!("Failed to delete wallet file: {}", e)));
            }
            println!("钱包文件删除成功");
        } else {
            println!("钱包文件不存在: {:?}", wallet_file);
        }

        // 删除交易文件夹
        if transactions_dir.exists() {
            println!("交易文件夹存在，正在删除...");
            if let Err(e) = std::fs::remove_dir_all(&transactions_dir) {
                println!("删除交易文件夹失败: {}", e);
                return Err(Error::Custom(format!("Failed to delete transactions directory: {}", e)));
            }
            println!("交易文件夹删除成功");
        } else {
            println!("交易文件夹不存在: {:?}", transactions_dir);
        }

        Ok(())
    }

    pub fn render_confirm_dialog(&mut self, ui: &mut Ui) -> bool {
        if let DeleteState::Confirm { wallet_descriptor } = &self.state {
            ui.label(i18n("Delete Wallet"));
            ui.separator();
            
            ui.label(format!("{}: {}", i18n("Wallet Name"), 
                wallet_descriptor.title.as_deref().unwrap_or("NO NAME")));
            ui.label(format!("{}: {}", i18n("File Name"), wallet_descriptor.filename));
            
            ui.label("");
            ui.colored_label(theme_color().alert_color, 
                i18n("⚠️ WARNING: This action cannot be undone!"));
            ui.label(i18n("All wallet data, including private keys and transaction history, will be permanently deleted."));
            
            ui.label("");
            ui.label(format!("{} 'DELETE' {}", i18n("Please type"), i18n("to confirm:")));
            
            let response = ui.text_edit_singleline(&mut self.confirm_text);
            response.request_focus();
            
            ui.label("");
            
            let mut confirmed = false;
            ui.horizontal(|ui| {
                if ui.button(i18n("Cancel")).clicked() {
                    self.cancel_delete();
                }
                
                ui.with_layout(Layout::right_to_left(Align::Min), |ui| {
                    let can_delete = self.confirm_text == "DELETE";
                    if ui.add_enabled(can_delete, Button::new(i18n("Delete Wallet")))
                        .clicked() && can_delete {
                        confirmed = true;
                    }
                });
            });
            
            confirmed
        } else {
            false
        }
    }

    pub fn render_delete_progress(&mut self, ui: &mut Ui, core: &mut Core) {
        match &self.state {
            DeleteState::Deleting { .. } => {
                ui.vertical_centered(|ui| {
                    ui.label(i18n("Deleting wallet..."));
                    ui.add(egui::Spinner::new().size(32.0));
                });
            }
            DeleteState::Completed => {
                ui.vertical_centered(|ui| {
                    ui.label(i18n("Wallet deleted successfully"));
                    ui.label("");
                    ui.label(i18n("Click OK to return to wallet selection"));
                    if ui.button(i18n("OK")).clicked() {
                        self.state = DeleteState::Idle;
                        // 返回到钱包选择页面
                        core.back();
                    }
                });
            }
            DeleteState::Error { error } => {
                let error_msg = error.to_string();
                ui.vertical_centered(|ui| {
                    ui.colored_label(theme_color().error_color, 
                        format!("{}: {}", i18n("Error"), error_msg));
                    if ui.button(i18n("OK")).clicked() {
                        self.state = DeleteState::Idle;
                        // 返回到钱包选择状态
                        // 注意：这里需要调用Core的back方法，但需要确保Core有这个方法
                        // 暂时跳过，让用户手动返回
                    }
                });
            }
            _ => {}
        }
    }
}

impl ModuleT for WalletDelete {
    fn style(&self) -> ModuleStyle {
        ModuleStyle::Mobile
    }

    fn secure(&self) -> bool {
        true
    }

    fn render(
        &mut self,
        core: &mut Core,
        _ctx: &egui::Context,
        _frame: &mut eframe::Frame,
        ui: &mut egui::Ui,
    ) {
        match &self.state {
            DeleteState::Idle => {
                // 不显示任何内容
            }
            DeleteState::Confirm { .. } => {
                // 显示确认对话框
                if self.render_confirm_dialog(ui) {
                    // 用户确认删除，执行删除操作
                    self.execute_delete(core, ui);
                }
            }
            DeleteState::Deleting { .. } | DeleteState::Completed | DeleteState::Error { .. } => {
                self.render_delete_progress(ui, core);
            }
        }
    }
}
