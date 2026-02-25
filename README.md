# 🛡️ Ironclad Protocol: The Bitcoin-Native Independent Logic

![Ironclad Banner](frontend/public/assets/logo.png)

**Ironclad** is a premium, high-fidelity decentralized financial protocol engineered on the **Stacks L2** blockchain. It bridges the gap between Bitcoin's security and programmatic decentralized finance, offering users a "Self-Custodial Savings" environment where every "HODL" is reinforced by Decidable Smart Contract logic and Bitcoin finality.

---

## 🏛️ Project Philosophy

In a world of volatile emotional trading, Ironclad provides a **Zero-Trust Institutional Interface** for long-term capital preservation. By utilizing the **Stacks Proof-of-Transfer (PoX)** mechanism and **SIP-010** assets, we ensure that user commitments are immutable, verifiable, and strictly enforced by the network.

---

## ✨ Conceivable Feature Suite

### 1. 🔐 Multi-Layer Authentication Hub

- **Wallet Handshake**: Proactive detection and automated authorization for Stacks (Leather/Xverse) and Bitcoin wallets.
- **Protocol Handshake logic**: Intelligent session management that verifies cryptographic anchors upon entry.
- **Social & Legacy Integration**: Production-ready Google OAuth 2.0 and encrypted Email/Password authentication.
- **Unified Session Architecture**: Seamless transition between credential-based and wallet-based identity.

### 2. 💎 Non-Custodial Savings Vaults (The Core)

- **Cryptographic Commitments**: Lock BTC-native assets (sBTC, STX) in rules-based vaults without third-party risk.
- **Time-Locked Enforcements**: Commitments are strictly governed by Stacks Block Height, ensuring mathematical certainty for savings.
- **Penalty Severity Scaling**: User-defined penalty coefficients for early withdrawals (Simulation Level).
- **Maturity Tracking**: Real-time progress bars and block-height countdowns for every active vault.
- **Institutional Manifests**: Standardized technical specifications for every on-chain savings plan.

### 3. 🧬 Identity Matrix & Personalization

- **Identity Matrix**: A curated library of unique, protocol-themed avatars generated for user distinction.
- **Initials-Based Fallbacks**: Dynamic SVG avatar generation for users without a selected matrix entry.
- **Global Profile Sync**: Unified management of display names, bios, countries, timezones, and preferred currencies.
- **Verified Reputation**: On-chain tracking of user standing, rank (Sentinel -> Knight -> Oracle), and achievements.
- **Soulbound Achievements**: Unlock immutable protocol badges for loyalty milestones (Genesis Seal, Halving Survivor).

### 4. 📜 Immutable Protocol Ledger

- **Real-time Activity Stream**: Live monitoring of all L1/L2 transactions related to your protocol interaction.
- **L1 Status Verification**: Direct integration with the Stacks blockchain to track pending/confirmed states.
- **Protocol Intent Detection**: Automated labeling of transaction types (Peer Transfer, Protocol Integration, Contract Call).
- **Hiro Explorer Integration**: Deep-linking to the Hiro Explorer for forensic inspection of every transaction hash.

### 5. 📈 Live Network Intelligence

- **Network Health Telemetry**: Real-time monitoring of mempool congestion, block-height, and L2 confirmation speeds.
- **Yield Velocity Analytics**: Visualization of protocol-locked APY and institutional demand trends.
- **Integrity Index**: Continuous verification of PoX (Proof-of-Transfer) cycle status and sBTC integration health.
- **TVL Insights**: Dynamic assessment of the protocol's total value locked relative to previous cycles.

### 6. ⚖️ Independent Governance Hub

- **Weighted vSTX Voting**: Governance power calculated based on reputation-weighted holdings.
- **Proposal Lifecycle**: Track, analyze, and vote on IP (Ironclad Proposal) targets.
- **Governance Multipliers**: High reputation score acts as a multiplier for your protocol influence.
- **Transparent Decisioning**: Fully on-chain voting records for all protocol parameter changes.

### 7. 🛡️ Sovereign Security Center

- **Local-First Encryption**: All sensitive data (wallets, phrases) are encrypted locally using military-grade AES-256 before storage.
- **Deterministic Recovery**: Standard 12-word BIP39 recovery phrases for absolute self-sovereignty.
- **Audit-Verified Architecture**: Design patterns optimized for Clarity's decidability to prevent re-entrancy and overflow bugs.
- **Emergency Circuit Breaker**: Multi-sig controlled defensive logic for extreme network volatility events.

### 8. 🎨 Premium Glassmorphic Design System

- **Visual Excellence**: High-fidelity UI featuring dynamic ambient background gradients and glassmorphism.
- **Mobile-First Response**: Fully optimized experience across mobile, tablet, and ultra-wide displays.
- **Micro-Animations**: Extensive use of Framer Motion for liquid state transitions and hover interaction feedback.
- **Dark-Mode Optimized**: Hand-crafted color palettes (Primary #A9D0C3, Background-Dark #0A0A0B) for 24/7 terminal comfort.

---

## 🧱 Technical Architecture

### 📜 Smart Contract Layer (Clarity 2.0)

- **`savings.clar`**: Manages vault formation, funding, and release logic.
- **`verification.clar`**: Confirms block height and protocol conditions.
- **`registry.clar`**: The source of truth for protocol identity.
- **`governance.clar`**: Manages the decentralized parameter selection.

### 🌐 Full-Stack Implementation

- **Frontend**: Next.js 16 (App Router) + React 19.
- **Styling**: Tailwind CSS v4 + Professional Design Tokens.
- **ORM**: Prisma with Supabase PostgreSQL for profile metadata.
- **Auth**: Next-Auth v5 (Beta) + Argon2/Bcrypt Password Hashing.

---

## 🔄 Usage Workflow

1.  **Handshake**: Connect your Stacks wallet (Leather/Xverse) or sign in with Google.
2.  **Onboarding**: Complete the identity initialization to anchor your protocol profile.
3.  **Sealing**: Define your duration, target amount, and asset allocation.
4.  **Monitoring**: Track the immutable growth of your capital via the Dashboard and Ledger.
5.  **Release**: Reclaim your assets once the blockchain reaches the verified maturity height.

---

## 💻 Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Setup Database
cd frontend
npx prisma db push
npx prisma generate

# Run Development Server
npm run dev
```

---

_Verified Ironclad Protocol v2.1.0_  
_Ironclad Protocol © 2026_
