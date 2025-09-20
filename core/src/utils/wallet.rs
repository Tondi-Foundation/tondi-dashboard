use crate::imports::*;
use std::fmt::Display;

// 定义我们自己的 EncryptedMnemonic 结构
#[derive(Debug, Clone)]
pub struct EncryptedMnemonic<T> {
    pub cipher: T,
    pub salt: T,
}

#[derive(Debug)]
pub struct SingleWalletFileV0 {
    pub num_threads: u32,
    pub encrypted_mnemonic: EncryptedMnemonic<Vec<u8>>,
    pub xpublic_key: String,
    pub ecdsa: bool,
}
impl Clone for SingleWalletFileV0 {
    fn clone(&self) -> Self {
        Self {
            num_threads: self.num_threads,
            encrypted_mnemonic: EncryptedMnemonic {
                cipher: self.encrypted_mnemonic.cipher.clone(),
                salt: self.encrypted_mnemonic.salt.clone(),
            },
            xpublic_key: self.xpublic_key.clone(),
            ecdsa: self.ecdsa,
        }
    }
}

#[derive(Debug, Clone)]
pub enum WalletType {
    SingleV0(SingleWalletFileV0),
}

#[derive(Debug, Default, Deserialize)]
struct EncryptedMnemonicIntermediate {
    #[serde(with = "tondi_utils::serde_bytes")]
    cipher: Vec<u8>,
    #[serde(with = "tondi_utils::serde_bytes")]
    salt: Vec<u8>,
}
impl From<EncryptedMnemonicIntermediate> for EncryptedMnemonic<Vec<u8>> {
    fn from(value: EncryptedMnemonicIntermediate) -> Self {
        Self {
            cipher: value.cipher,
            salt: value.salt,
        }
    }
}

//golang wallet file
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UnifiedWalletIntermediate {
    version: u32,
    num_threads: Option<u8>,
    encrypted_mnemonics: Vec<EncryptedMnemonicIntermediate>,
    public_keys: Vec<String>,
    ecdsa: bool,
}

impl UnifiedWalletIntermediate {
    fn into_wallet_type(mut self) -> Result<WalletType> {
        let single = self.encrypted_mnemonics.len() == 1 && self.public_keys.len() == 1;
        let wallet = match (single, self.version) {
            (true, 0) | (true, 1) => {
                WalletType::SingleV0(SingleWalletFileV0 {
                    num_threads: self
                    .num_threads
                    .unwrap_or(8)
                    as u32,
                    encrypted_mnemonic: std::mem::take(&mut self.encrypted_mnemonics[0]).into(),
                    xpublic_key: self.public_keys[0].to_string(),
                    ecdsa: self.ecdsa,
                })
            }
            _ => return Err(Error::custom("Multisig wallet import is not supported.")),
        };

        Ok(wallet)
    }
}

#[derive(Debug, Clone)]
pub enum WalletFileData {
    GoWallet(WalletType),
    Core(String),
}

#[derive(Debug, Clone)]
pub enum WalletFileDecryptedData {
    Core(String),
}

impl Display for WalletFileData {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::GoWallet(data) => f.write_str(&format!("Go Wallet: {data:?}")),
            Self::Core(data) => f.write_str(&format!("Core BIP-44: {data}")),
        }
    }
}

pub fn parse_wallet_file(contents: &str) -> Result<WalletFileData> {
    if let Ok(data) = serde_json::from_str::<UnifiedWalletIntermediate>(contents) {
        Ok(WalletFileData::GoWallet(data.into_wallet_type()?))
    } else {
        Err(Error::Custom("Unable to parse wallet file".into()))
    }
}
