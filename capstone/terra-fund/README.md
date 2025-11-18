# 🌍 TerraFund

A decentralized crowdfunding platform built on Solana blockchain, enabling transparent and secure fundraising campaigns with smart contract automation.

## ✨ Features

- 🚀 **Decentralized Campaigns** - Create and manage crowdfunding campaigns on Solana
- 💰 **Transparent Donations** - All transactions recorded on-chain with full transparency
- 🔒 **Secure Withdrawals** - Smart contract-enforced withdrawal rules with platform fees
- 📊 **Real-time Tracking** - Monitor campaign progress and donation history
- ⚡ **Fast & Low Cost** - Leverage Solana's high performance and low transaction fees
- 🎯 **Platform Fees** - Configurable platform fee system (default 7%)

## 🏗️ Architecture

### Smart Contract Features
- **Campaign Management**: Create, update, and delete campaigns
- **Donation System**: Accept donations with automatic balance tracking
- **Withdrawal Logic**: Secure withdrawals with minimum thresholds (>1 SOL)
- **Platform Fees**: Automatic fee distribution on withdrawals
- **Access Control**: Creator-only modifications with ownership verification

### Tech Stack
- **Blockchain**: Solana
- **Smart Contracts**: Anchor Framework (Rust)
- **Frontend**: React + TypeScript
- **Wallet Integration**: Solana Wallet Adapter
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Installation |
|------|---------|-------------|
| Node.js | v18.18.0+ | [Download](https://nodejs.org/) |
| Rust | v1.77.2+ | [Install](https://rustup.rs/) |
| Anchor CLI | v0.30.1+ | `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force` |
| Solana CLI | v1.18.17+ | [Install](https://docs.solana.com/cli/install-solana-cli-tools) |
| pnpm | Latest | `npm install -g pnpm` |

### Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd terrafund

# 2. Install dependencies
pnpm install

# 3. Set up Solana wallet (if not already done)
solana-keygen new

# 4. Configure for devnet
solana config set --url devnet

# 5. Get devnet SOL
solana airdrop 2

# 6. Build the smart contract
pnpm anchor-build

# 7. Deploy to devnet
pnpm anchor deploy --provider.cluster devnet

# 8. Start the web app
pnpm dev
```

---

## 📁 Project Structure

```
terrafund/
├── anchor/                      # Solana program (smart contracts)
│   ├── programs/
│   │   └── terrafund/
│   │       ├── src/
│   │       │   ├── lib.rs      # Program entry point
│   │       │   ├── instructions/
│   │       │   │   ├── initialize.rs
│   │       │   │   ├── create_campaign.rs
│   │       │   │   ├── update_campaign.rs
│   │       │   │   ├── delete_campaign.rs
│   │       │   │   ├── donate.rs
│   │       │   │   ├── withdraw.rs
│   │       │   │   └── update_platform_settings.rs
│   │       │   ├── states/     # Account structures
│   │       │   ├── errors/     # Error definitions
│   │       │   └── constants/  # Program constants
│   │       └── Cargo.toml
│   ├── tests/                   # Integration tests
│   │   └── terrafund.spec.ts
│   ├── scripts/                 # Utility scripts
│   │   ├── initialize.ts       # Initialize program
│   │   ├── genuser.ts          # Generate test user
│   │   └── fund-wallets.ts     # Fund test wallets
│   └── target/                  # Build artifacts
├── web/                         # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   └── utils/              # Utilities
│   └── public/
└── package.json
```

---

## 🔧 Development

### Anchor Program (Smart Contracts)

#### Build the Program

```bash
cd anchor
anchor build
```

Or from root:
```bash
pnpm anchor-build
```

#### Sync Program ID

After building, sync the program ID across all files:

```bash
pnpm anchor keys sync
```

**Important**: Manually update the program ID in `anchor/lib/basic-exports.ts` to match the generated ID.

#### Run Tests

```bash
# Run all tests
pnpm anchor-test

# Run tests with detailed logs
pnpm anchor test -- --verbose
```

#### Local Development

Start a local Solana validator with the program deployed:

```bash
pnpm anchor-localnet
```

In another terminal, run the web app:
```bash
pnpm dev
```

#### Deploy to Devnet

```bash
# Make sure you have devnet SOL
solana balance --url devnet

# If balance is low, airdrop
solana airdrop 2 --url devnet

# Deploy
pnpm anchor deploy --provider.cluster devnet
```

#### Initialize the Program

After deploying, initialize the program state:

```bash
cd anchor
ts-node scripts/initialize.ts
```

### Web Application

#### Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` (or the port shown in terminal)

#### Build for Production

```bash
pnpm build
```

#### Preview Production Build

```bash
pnpm preview
```

---

## 🧪 Testing

### Running Tests

The test suite covers all program instructions:

```bash
cd anchor
anchor test
```

### Test Coverage

- ✅ Program initialization
- ✅ Campaign creation
- ✅ Campaign updates
- ✅ Donations with balance tracking
- ✅ Withdrawals with fee distribution
- ✅ Platform settings updates
- ✅ Campaign deletion

### Test Wallets

Generate test wallets for development:

```bash
cd anchor
ts-node scripts/genuser.ts
```

### Funding Test Wallets

If you hit devnet rate limits:

```bash
# Option 1: Use the funding script
npx esrun scripts/fund-wallets.ts

# Option 2: Manual funding
solana airdrop 2 <WALLET_ADDRESS> --url devnet

# Option 3: Use web faucets
# Visit: https://faucet.solana.com
```

**Important**: The test suite requires:
- Creator wallet: minimum 2 SOL
- Donor wallet: minimum 3 SOL for testing donations

See [RATE_LIMIT_GUIDE.md](./RATE_LIMIT_GUIDE.md) for detailed troubleshooting.

---

## 🎯 Smart Contract Interface

### Instructions

#### Initialize Program
```rust
initialize() -> Result<()>
```
Initializes the program state (one-time setup).

#### Create Campaign
```rust
create_campaign(
    title: String,
    description: String,
    image_url: String,
    goal: u64
) -> Result<()>
```
Creates a new fundraising campaign.

#### Update Campaign
```rust
update_campaign(
    cid: u64,
    title: String,
    description: String,
    image_url: String,
    goal: u64
) -> Result<()>
```
Updates an existing campaign (creator only).

#### Donate
```rust
donate(
    cid: u64,
    amount: u64
) -> Result<()>
```
Make a donation to a campaign.

#### Withdraw
```rust
withdraw(
    cid: u64,
    amount: u64
) -> Result<()>
```
Withdraw funds from a campaign (creator only).

**Requirements**:
- Amount must be > 1 SOL (1,000,000,000 lamports)
- Sufficient campaign balance
- Creator authorization

#### Delete Campaign
```rust
delete_campaign(cid: u64) -> Result<()>
```
Marks a campaign as inactive (creator only).

#### Update Platform Settings
```rust
update_platform_settings(
    new_platform_fee: u64
) -> Result<()>
```
Updates the platform fee percentage (deployer only).

---

## 💡 Key Concepts

### Withdrawal Rules

The smart contract enforces a minimum withdrawal of **greater than 1 SOL** to ensure:
- Sufficient rent-exempt balance remains in the campaign PDA
- Transaction fees can be covered
- Account doesn't get closed accidentally

### Platform Fees

- Default platform fee: **7%**
- Applied on withdrawals
- Automatically distributed to platform address
- Configurable by program deployer

### Campaign Balance Tracking

Two balance fields are maintained:
- `amount_raised`: Total donations received (never decreases)
- `balance`: Current available balance (decreases with withdrawals)

---

## 🐛 Troubleshooting

### Common Issues

#### "429 Too Many Requests" (Airdrop Rate Limit)
**Solution**: Use alternative methods to fund wallets
```bash
# Option 1: Wait 30-60 minutes and retry
# Option 2: Use web faucet at https://faucet.solana.com
# Option 3: Use alternative faucets:
#   - https://solfaucet.com
#   - https://faucet.quicknode.com/solana/devnet
```

#### "Insufficient funds" Error
**Solution**: Ensure wallets have enough SOL
```bash
# Check balance
solana balance --url devnet

# Get more SOL
solana airdrop 2 --url devnet
```

#### "Program ID mismatch"
**Solution**: Sync program IDs after building
```bash
pnpm anchor keys sync
# Then update anchor/lib/basic-exports.ts manually
```

#### "Withdrawal amount must be at least 1 SOL"
**Solution**: This is expected behavior - withdraw more than 1 SOL:
```typescript
// ❌ Wrong
const amount = new BN(1 * LAMPORTS_PER_SOL); // Exactly 1 SOL - rejected

// ✅ Correct
const amount = new BN(1.5 * LAMPORTS_PER_SOL); // More than 1 SOL - accepted
```

#### Tests Failing
**Solution**: Ensure proper setup
```bash
# 1. Generate test user
cd anchor
ts-node scripts/genuser.ts

# 2. Fund wallets
ts-node scripts/fund-wallets.ts

# 3. Run tests
anchor test
```

---

## 🔐 Security Considerations

### Smart Contract Security
- ✅ Creator-only modifications enforced
- ✅ Balance overflow protection with `checked_add`
- ✅ Rent-exempt balance protection
- ✅ Platform address verification
- ✅ Campaign ID validation

### Best Practices
- Always test on devnet before mainnet
- Verify program IDs match across all files
- Keep private keys secure (never commit to git)
- Monitor transaction fees and rent requirements
- Implement frontend validation before transactions

---

## 📊 Program Accounts

### ProgramState
```rust
pub struct ProgramState {
    pub initialized: bool,
    pub campaign_count: u64,
    pub platform_fee: u64,
    pub platform_address: Pubkey,
}
```

### Campaign
```rust
pub struct Campaign {
    pub cid: u64,
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub image_url: String,
    pub goal: u64,
    pub amount_raised: u64,
    pub timestamp: u64,
    pub donors: u64,
    pub withdrawals: u64,
    pub balance: u64,
    pub active: bool,
}
```

### Transaction
```rust
pub struct Transaction {
    pub owner: Pubkey,
    pub cid: u64,
    pub amount: u64,
    pub timestamp: u64,
    pub credited: bool,
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow Rust and TypeScript best practices
- Update documentation for API changes
- Run `anchor test` before submitting PR

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```bash
# Solana Network
NEXT_PUBLIC_CLUSTER=devnet  # or mainnet-beta, localnet

# Program ID (update after building)
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here

# RPC Endpoint (optional - uses public endpoints by default)
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

---

## 📚 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Program Library](https://spl.solana.com/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [RATE_LIMIT_GUIDE.md](./RATE_LIMIT_GUIDE.md)
3. Open an issue on GitHub
4. Contact the development team

---

## 🎉 Acknowledgments

Built with ❤️ using:
- [Solana](https://solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

Made with 🌍 by the TerraFund Team