# Legacy Import Wallet 功能删除总结

## 概述
已成功删除非BIP44的Legacy Import Wallet功能，包括前端UI和后端逻辑。

## 删除的功能

### 1. 前端UI删除
- 删除了"Legacy 12 word mnemonic"选项按钮
- 删除了"Select this option if your wallet was created using KDX or tondinet.io web wallet"相关说明
- 删除了Legacy wallet导入的UI界面元素

### 2. 后端逻辑删除
- 删除了`import_legacy`字段和相关逻辑
- 删除了`AccountCreateArgs::new_legacy()`的调用
- 删除了Legacy wallet文件的解析和处理
- 删除了Legacy account的创建逻辑

### 3. 数据结构删除
- 删除了`WalletFileData::Legacy`枚举变体
- 删除了`WalletFileDecryptedData::Legacy`枚举变体
- 删除了`LegacyWalletJSON`和`LegacyWalletJSONInner`结构体
- 删除了`LEGACY_ACCOUNT_KIND`常量

### 4. 文件过滤器删除
- 删除了"LegacyWallet"文件过滤器（.kpk文件）
- 只保留"GolangWallet"文件过滤器（.json文件）

## 修改的文件

### core/src/modules/wallet_create.rs
- 删除了`import_legacy`字段
- 简化了`import_selection`函数
- 删除了Legacy wallet导入逻辑
- 删除了Legacy account创建逻辑
- 修复了代码结构问题

### core/src/modules/account_create.rs
- 删除了`import_legacy`字段
- 简化了account创建逻辑，只使用BIP32

### core/src/utils/wallet.rs
- 删除了Legacy相关的数据结构和解析逻辑
- 简化了wallet文件解析

### core/src/primitives/account.rs
- 删除了`LEGACY_ACCOUNT_KIND`引用
- 删除了Legacy account的描述

### core/src/modules/scanner.rs
- 删除了对Legacy account的支持

## 保留的功能
- BIP32/BIP44 wallet导入功能
- Golang wallet文件导入功能
- 12/24词助记词导入功能
- BIP39 passphrase支持

## 影响
- 用户无法再导入KDX或tondinet.io web wallet创建的Legacy wallet
- 所有新创建的account都使用BIP32标准
- 提高了wallet的安全性和标准化程度

## 编译状态
✅ 代码编译通过，无语法错误
✅ 所有Legacy相关引用已清理完成
✅ 代码结构已修复，无语法问题

## 最终验证
- 所有`import_legacy`字段引用已从代码中完全删除
- 所有`LEGACY_ACCOUNT_KIND`引用已清理
- 所有Legacy相关的数据结构已删除
- 代码编译通过，功能完整
