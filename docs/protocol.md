# Programmable Bitcoin Savings Protocol Specification

## Overview

The protocol allows users to trustlessly lock Bitcoin (via sBTC) into a Stacks-based smart contract. The savings behavior is programmable, allowing for lock periods, automated yield distribution, and conditional withdrawals.

## Smart Contract Architecture

### `savings-vault.clar`

- **Deposit**: Accepts sBTC and records the user's balance and current block height.
- **Withdraw**: Validates balance and lock conditions before releasing sBTC.
- **Governance**: Basic ownership controls for protocol parameters (e.g., minimum lock time).

### `sbtc-token.clar` (Integration)

- Implements the SIP-010 fungible token standard.
- Facilitates the transfer of Bitcoin value on the Stacks layer.

## Frontend Architecture

### State Management

- **Stacks User Session**: Managed via `@stacks/connect`.
- **Wallet Connection**: Supports Leather and Xverse.

### UI Components

- **Vault Dashboard**: Real-time balance and APY visualization.
- **Deposit Flow**: Multi-step confirmation with Stacks post-conditions for security.

## Security Considerations

- **Non-Custodial**: Users always retain control via Stacks smart contracts.
- **Post-Conditions**: Every transaction is protected by Stacks post-conditions to prevent unexpected token outflows.
