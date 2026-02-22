# 🛡️ Ironclad Protocol: Sovereign Bitcoin Savings

![Ironclad Banner](frontend/public/assets/logo.png)

**Ironclad** is a high-fidelity, non-custodial decentralized financial protocol engineered on the **Stacks L2** blockchain. It bridges the gap between Bitcoin's security and programmatic decentralized finance, offering users a "Sovereign Savings" environment where "HODL" is reinforced by Decidable Smart Contract logic.

---

## 🏛️ Project Philosophy

In a world of volatile emotional trading, Ironclad provides a **Zero-Trust Institutional Interface** for long-term capital preservation. By utilizing the **Stacks Proof-of-Transfer (PoX)** mechanism and **SIP-010** assets, we ensure that user commitments are immutable, verifiable, and strictly enforced by the network.

---

## 🧱 Technical Architecture

### 📜 Smart Contract Layer (Clarity)

Our contracts are written in **Clarity 2.0**, a decidable language that prevents entire classes of smart contract bugs (e.g., re-entrancy).

- **`savings.clar`**: The central engine. Manages vault creation, duration locking, and target definitions.
- **`verification.clar`**: The integrity bridge. Integrates Oracle-signed BTC state and on-chain time conditions to verify unlock eligibility.
- **`registry.clar`**: Protocol identity registry. Manages user registration and sovereign standing within the ecosystem.
- **`governance.clar`**: Protocol parameters. Defines system-wide constants like `min-lock` duration and the global `paused` state.
- **`emergency.clar`**: Defensive logic. Provides a multi-sig controlled "circuit-breaker" to protect user capital.

### 🌐 Frontend Layer (Cutting-Edge Stack)

A premium dashboard built with a **Mobile-First Glassmorphic** aesthetic.

- **Engine**: React 19 + Next.js 16 (App Router).
- **Styling**: Tailwind CSS v4 featuring professional design tokens and standard shades.
- **Motion**: Framer Motion 12 for seamless state transitions and high-performance micro-animations.
- **Persistence**: Dexie.js for low-latency local storage of protocol alerts and notifications.

### 💾 Persistence Layer (Prisma & Postgres)

While the protocol is non-custodial, we maintain a secure decentralized-ready backend for off-chain profile data.

- **Identity**: Supabase Postgres with Prisma ORM.
- **Models**:
  - `User`: Core authentication entity (Email, Google, or Wallet).
  - `Profile`: Sovereign metadata including:
    - **`reputation`**: Protocol-verified loyalty score.
    - **`rank`**: Tier-based ranking (`SENTINEL` -> `KNIGHT` -> `ORACLE`).
    - **`achievements`**: Soulbound achievement matrix (JSON-verified).
    - **`autoPersistence`**: Real-time cloud-sync heartbeat toggle.
    - **`walletBindingTimestamp`**: Cryptographic anchor of identity maturity.

---

## ✨ Key Protocol Features

### 1. 💎 Savings Vaults (Non-Custodial)

Users seal assets in cryptographic vaults. Once sealed, assets are inaccessible until the **Stacks Block Height** reaches the predefined duration.

- **Dynamic Lock Calculation**: 1 Month ≈ 4,320 Blocks.
- **Target Tracking**: Real-time progress visualization against protocol goals.
- **Institutional Manifests**: Exportable technical specifications of on-chain commitments.

### 2. 🧬 Reputation 2.0: Proof of Loyalty

The protocol features a data-driven reputation system that tracks your sovereign standing.

- **Tiered Progression**: Advance through ranks based on vault duration and volume.
- **Soulbound Badges**: Unlock immutable achievements like the "Genesis Seal" or "Halving Survivor".
- **Perks**: High reputation grants collateral efficiency, priority peg-outs, and weighted governance power.

### 3. ☁️ Cloud Heartbeat & Sync

The **Ironclad Cloud** ensures your sovereign profile persists seamlessly across the protocol.

- **Automatic Persistence**: Real-time broadcast of local changes to the cloud vault.
- **Protocol Re-sync**: Force a clean state refresh directly from the Ironclad Protocol layer.
- **Handshake Verification**: Multi-layered logging and error handling for synchronization integrity.

### 4. ⚖️ Sovereign Governance

Participate in the future of the protocol using reputation-weighted voting power (`vSTX`).

- **Proposal Participation**: Cast sovereign votes on IP (Ironclad Proposal) targets.
- **Weighted Weight**: Your reputation score acts as a multiplier for your governance influence.

---

## 🔄 Protocol Usage Workflow

### 1. The Onboarding Matrix

- **Connect**: Utilize `Leather` or `Xverse` wallets via Stacks Connect.
- **Initialize**: Navigate the multi-step onboarding flow to anchor your identity.
- **Bind**: Synchronize your Bitcoin and Stacks addresses into a sovereign bundle.

### 2. Sealing the Vault

- **Action**: Click "Initialize Deposit" from the Sovereign Dashboard.
- **Step 1 (Duration)**: Select a lock-in period (e.g., 144 Blocks, 2016 Blocks).
- **Step 2 (Allocation)**: Define your target amount and penalty severity.
- **Step 3 (Confirm)**: Execute the `create-plan` function. Your commitment is now inscribed.

### 3. Verification & Settlement

- Once the lock elapses, the **Verification Bridge** verifies your eligibility.
- The protocol calls the `verify-time` contract to confirm the block height.
- Markers for completion are updated on-chain, and assets are released.

---

## 💻 Development & Deployment

### Environment Configuration

Ensure your `frontend/.env` includes:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST... # Stacks Contract address
NEXT_PUBLIC_NETWORK=testnet        # 'mainnet' or 'testnet'
DATABASE_URL=postgresql://...      # Postgres connection
NEXTAUTH_SECRET=...               # Secret for session encryption
```

### Installation Suite

```bash
# 1. Install Workspace Dependencies
npm install --legacy-peer-deps

# 2. Synchronize Database Schema
cd frontend
npx prisma db push
npx prisma generate

# 3. Launch the Sovereign Interface
npm run dev
```

---

## 🔒 Security Architecture

- **Non-Custodial**: Neither the Ironclad team nor the Smart Contracts have access to your private keys.
- **Atomic Operations**: All vault updates are atomic in the Stacks environment.
- **Decidability**: Clarity language prevents common vulnerabilities like re-entrancy and integer overflows.

---

## 🗺️ Engineering Roadmap

- [x] **v1.4.2**: Sovereign UI Launch & Basic Vault Management.
- [x] **v2.0.0**: Reputation Matrix & Cloud Sync Heartbeats.
- [x] **v2.1.0**: Sovereign Governance Voting Primitives.
- [ ] **v2.2.0**: sBTC integrated liquidity into Savings Vaults.
- [ ] **v3.0.0**: Cross-Chain Sovereign Settlement layer.

---

_Verified Ironclad Protocol v2.1.0_  
_Ironclad Sovereign Protocol © 2026_
