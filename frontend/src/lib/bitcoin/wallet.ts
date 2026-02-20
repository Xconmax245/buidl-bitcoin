
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

// Initialize BIP32 factory with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

// Network Selection
// TODO: Make this configurable via env var
const NETWORK = bitcoin.networks.testnet; 

export interface WalletKeys {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  xpub: string; // Account implementation xpub
  address: string;
  path: string;
}

export class BitcoinWallet {
  /**
   * Generates a new random mnemonic phrase (12 words)
   */
  static generateMnemonic(): string {
    return bip39.generateMnemonic(128); // 128 bits -> 12 words
  }

  /**
   * Validates a mnemonic phrase
   */
  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  /**
   * Derives a wallet from a mnemonic phrase using BIP-84 (Native Segwit)
   * Path: m/84'/1'/0'/0/0 (Testnet) or m/84'/0'/0'/0/0 (Mainnet)
   */
  static fromMnemonic(mnemonic: string, accountIndex = 0, addressIndex = 0): WalletKeys {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, NETWORK);

    // BIP-84: Native Segwit
    const purpose = 84;
    const coinType = NETWORK === bitcoin.networks.bitcoin ? 0 : 1;
    
    // Account path: m/84'/coinType'/accountIndex'
    const accountPath = `m/${purpose}'/${coinType}'/${accountIndex}'`;
    const accountNode = root.derivePath(accountPath);
    const xpub = accountNode.neutered().toBase58();

    // Address path: .../change/index
    const path = `${accountPath}/0/${addressIndex}`;
    const child = root.derivePath(path);
    
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: NETWORK,
    });

    if (!address || !child.privateKey) {
      throw new Error('Failed to generate address');
    }

    return {
      mnemonic,
      privateKey: Buffer.from(child.privateKey).toString('hex'), 
      publicKey: Buffer.from(child.publicKey).toString('hex'),
      xpub,
      address,
      path,
    };
  }

  /**
   * Derives multiple addresses for scanning (gap limit)
   */
  static deriveAddresses(mnemonic: string, count: number, offset = 0): string[] {
    const addresses: string[] = [];
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, NETWORK);
    
    // Use proper path derivation as seen in fromMnemonic
    // But BIP84 standard is: m / 84' / coin_type' / account' / change / address_index
    // We want the account xpub at: m / 84' / coin_type' / account'
    
    const purpose = 84;
    const coinType = NETWORK === bitcoin.networks.bitcoin ? 0 : 1;
    const accountIndex = 0; // Default account

    // Derive addresses...
    // Note: The original code for addresses derivation looks correct for individual addresses.
    // I will keep it as is, just ensuring the imports remain valid.
    
    // Correct loop based on original code structure which was fine for address generation
    for (let i = 0; i < count; i++) {
        const path = `m/${purpose}'/${coinType}'/${accountIndex}'/0/${offset + i}`;
        const child = root.derivePath(path);
        const { address } = bitcoin.payments.p2wpkh({
            pubkey: child.publicKey,
            network: NETWORK,
        });
        if (address) addresses.push(address);
    }
    
    return addresses;
  }

  /**
   * Get Extended Public Key (xpub) for the default account
   * Path: m/84'/0'/0' (or 1' for testnet)
   */
  static getAccountXPub(mnemonic: string, accountIndex = 0): string {
    if (!this.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, NETWORK);

    const purpose = 84;
    const coinType = NETWORK === bitcoin.networks.bitcoin ? 0 : 1;
    
    const path = `m/${purpose}'/${coinType}'/${accountIndex}'`;
    const account = root.derivePath(path);
    
    return account.neutered().toBase58();
  }
}
