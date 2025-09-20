# Tondi Dashboard

A modern, feature-rich Tondi blockchain wallet and account management dashboard. Built with Rust and WebAssembly for optimal performance and security.

## 🚀 Key Features

- **Multi-platform Support**: Web application, Chrome extension, and native desktop app
- **Wallet Management**: Create, import, and manage Tondi wallets
- **Account Management**: Multi-account system with BIP32 derivation support
- **Transaction Tools**: Send, receive, and monitor Tondi transactions
- **Real-time Updates**: Live blockchain data and wallet synchronization
- **Security**: Encrypted storage and secure key management
- **User-friendly**: Modern UI built with egui framework
- **gRPC Integration**: gRPC communication support with Tondi nodes

## 🛠️ Technology Stack

- **Backend**: Rust 1.89+ with async/await
- **Frontend**: WebAssembly (WASM) via egui 0.31.1
- **Blockchain**: Tondi chain integration (v1.0.2)
- **Storage**: Local encrypted storage
- **Network**: gRPC client for node communication
- **UI Framework**: egui with eframe
- **Build Tools**: Trunk for WASM builds

## 📦 Installation

### Prerequisites

- Rust 1.89+ and Cargo
- Node.js 18+ (for web builds)
- Local or remote Tondi node running

### Build from Source

```bash
# Clone the repository
git clone https://github.com/AvatoLabs/tondi-dashboard.git
cd tondi-dashboard

# Build the project
cargo build --release

# Build web application
cd app
trunk build

# Build Chrome extension
cd ../extensions/chrome
cargo build --target wasm32-unknown-unknown --release

# Build Win
cargo build --release --target x86_64-pc-windows-gnu
```

### Running the Application

```bash
# Native desktop application
cargo run --bin tondi-dashboard

# Web application
cd app
trunk serve

# Chrome extension
# Load extension from extensions/chrome/dist/ directory
```

## 🔧 Configuration

The dashboard connects to Tondi nodes via gRPC. Configure your node connection in settings:

- **Network**: Mainnet or testnet
- **Node URL**: Your Tondi node RPC endpoint
- **Connection Type**: Direct or proxy connection

## 📱 Usage

### Creating a Wallet

1. Launch the application
2. Click "Create New Wallet"
3. Set wallet name and security options
4. Generate or import mnemonic phrase
5. Create initial account

### Managing Accounts

- **Create Account**: Generate new BIP32 accounts
- **Import Account**: Import existing accounts via mnemonic
- **Account Switching**: Seamlessly switch between accounts
- **Address Management**: Generate new addresses as needed

### Sending Transactions

1. Select source account
2. Enter recipient address
3. Specify amount and priority fee
4. Review transaction details
5. Confirm and broadcast

## 🏗️ Project Architecture

```
tondi-dashboard/
├── app/                    # Web application
├── core/                   # Core framework
│   ├── modules/           # Feature modules
│   ├── runtime/           # Runtime services
│   └── utils/             # Utility functions
├── extensions/            # Browser extensions
│   └── chrome/           # Chrome extension
└── macros/               # Procedural macros
```

## 🔒 Security Features

- **Encrypted Storage**: All sensitive data encrypted at rest
- **Secure Key Derivation**: BIP32/BIP39 compatible key generation
- **Memory Protection**: Secure memory handling and zeroing
- **Network Security**: Encrypted communication with nodes

## 🌐 Network Support

- **Mainnet**: Production Tondi network
- **Testnet**: Development and testing network
- **Custom Networks**: Support for custom node configurations

## 📊 Monitoring and Analytics

- **Real-time Balances**: Live account balance updates
- **Transaction History**: Complete transaction records
- **Network Status**: Node connection and sync status
- **Performance Metrics**: Transaction processing statistics

## 🧪 Testing

```bash
# Run tests
cargo test

# Run specific module tests
cargo test --package tondi-dashboard-core

# Run integration tests
cargo test --workspace

# Run wallet endpoint tests
cargo run --bin wallet_test_cli test

# Run quick tests
cargo run --bin wallet_test_cli quick
```

## 🔧 Wallet Endpoint Testing

The project includes comprehensive wallet endpoint testing tools:

### CLI Testing Tool

```bash
# Full wallet tests with custom configuration
cargo run --bin wallet_test_cli test --wallet-name "my_test_wallet" --network testnet

# Quick connectivity tests
cargo run --bin wallet_test_cli quick

# Help and options
cargo run --bin wallet_test_cli --help
```

### Integration Tests

The project includes a full suite of integration tests for wallet functionality:

- **RPC Connection Tests**: Verify node connectivity
- **Wallet Creation Tests**: Test wallet and account creation
- **Balance Query Tests**: Verify balance retrieval
- **Address Generation Tests**: Test address creation
- **Transaction Estimation Tests**: Verify fee calculation
- **Network Info Tests**: Test network data retrieval

See `WALLET_ENDPOINT_TESTING_GUIDE.md` for detailed testing documentation.

## 🤝 Contributing

We welcome contributions! Please check our contribution guidelines for details.

### Development Setup

```bash
# Install development dependencies
cargo install trunk
cargo install wasm-bindgen-cli

# Run tests
cargo test

# Code checking
cargo check

# Fix warnings
cargo clippy --fix
```

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Tondi Project](https://github.com/AvatoLabs/Tondi)
- [egui Framework](https://github.com/emilk/egui)
- [Rust Programming Language](https://www.rust-lang.org/)

## 📚 Documentation

- [Wallet Endpoint Testing Guide](WALLET_ENDPOINT_TESTING_GUIDE.md)
- [Tondi gRPC Implementation Summary](TONDI_GRPC_IMPLEMENTATION_SUMMARY.md)
