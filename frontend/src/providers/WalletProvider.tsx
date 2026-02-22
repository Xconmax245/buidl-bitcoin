
"use client";

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { db } from "@/lib/storage/db";
import { CryptoService } from "@/lib/security/crypto";
import { BitcoinClient } from "@/lib/bitcoin/client";
import type { WalletKeys } from "@/lib/bitcoin/wallet";
import { WalletSelectionModal } from "@/components/wallet/WalletSelectionModal";

// Lazy-load Stacks Connect and BitcoinWallet to avoid SSR/WASM issues
let _userSession: any = null;
let _BitcoinWallet: any = null;

const getStacksSession = async () => {
  if (_userSession) return _userSession;
  const { AppConfig, UserSession } = await import("@stacks/connect");
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  _userSession = new UserSession({ appConfig });
  return _userSession;
};

const getBitcoinWallet = async () => {
  if (_BitcoinWallet) return _BitcoinWallet;
  const mod = await import("@/lib/bitcoin/wallet");
  _BitcoinWallet = mod.BitcoinWallet;
  return _BitcoinWallet;
};

interface WalletState {
  hasWallet: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  address: string | null;
  balance: number; // satoshis
  walletType: 'local' | 'stacks' | null;
  userName: string | null;
  network: 'mainnet' | 'testnet';
  isInitialized: boolean;
}

interface WalletContextType extends WalletState {
  createWallet: (password: string, name?: string) => Promise<string>;
  restoreWallet: (mnemonic: string, password: string, name?: string) => Promise<void>;
  unlockWallet: (password: string) => Promise<boolean>;
  lockWallet: () => void;
  deleteWallet: () => Promise<void>;
  connectStacks: () => void;
  disconnectStacks: () => void;
  updateProfile: (name: string) => Promise<void>;
  setNetworkMode: (mode: 'mainnet' | 'testnet') => void;
  openWalletModal: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Initialize Stacks session on client
  useEffect(() => {
    getStacksSession().then(session => setUserSession(session));
  }, []);

  const [state, setState] = useState<WalletState>({
    hasWallet: false,
    isUnlocked: false,
    isLoading: true,
    address: null,
    balance: 0,
    walletType: null,
    userName: null,
    network: 'testnet',
    isInitialized: false,
  });

  // Sensitive keys kept in memory only while unlocked
  const [keys, setKeys] = useState<WalletKeys | null>(null);

  const checkWallet = async () => {
    try {
      if (typeof window === 'undefined') {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
      }

      const session = await getStacksSession();

      // Check settings for profile and network
      const savedName = await db.settings.get('userName');
      const savedNetwork = await db.settings.get('network');
      const network = (savedNetwork?.value as 'mainnet' | 'testnet') || 'testnet';

      // check local
      const count = await db.wallets.count();
      if (count > 0) {
        setState(prev => ({ 
            ...prev, 
            hasWallet: true, 
            walletType: 'local', 
            isLoading: false,
            userName: savedName?.value || null,
            network,
            isInitialized: !!savedName?.value
        }));
        return;
      }
      
      // check stacks
      if (session.isUserSignedIn()) {
        const userData = session.loadUserData();
        const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet; 
        setState(prev => ({ 
          ...prev, 
          hasWallet: true, 
          isUnlocked: true, 
          address: address, 
          walletType: 'stacks', 
          isLoading: false,
          userName: savedName?.value || userData.profile.name || null,
          network,
          isInitialized: true
        }));
        return;
      }

      setState(prev => ({ ...prev, hasWallet: false, isLoading: false, network }));
    } catch (error) {
      console.error("Failed to check wallet:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Check for existing wallet on mount (after session is ready)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    checkWallet();
  }, []);

  // Sync wallet binding to backend
  useEffect(() => {
    const sync = async () => {
        const session = await getStacksSession().catch(() => null);
        if (!state.hasWallet && !session?.isUserSignedIn()) return;

        const payload: any = {};
        
        // Add BTC xPub if unlocked
        if (state.isUnlocked && keys?.xpub) {
            payload.btcXpub = keys.xpub;
        }

        // Add Stacks Principal if connected
        if (session?.isUserSignedIn()) {
            const userData = session.loadUserData();
            const stxAddress = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
            payload.stacksPrincipal = stxAddress;
        }

        if (Object.keys(payload).length === 0) return;

        try {
            // Only send if we have at least one valid identifier to bind
            await fetch('/api/profile/bind-wallet', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            // diverse errors can happen (e.g. not auth'd yet), just log warning
            console.warn("Wallet binding sync skipped/failed", e);
        }
    };
    
    // Debounce slightly or just run
    const timeout = setTimeout(sync, 1000);
    return () => clearTimeout(timeout);
  }, [state.isUnlocked, keys, state.hasWallet]);

  const openWalletModal = () => setIsModalOpen(true);

  const connectStacks = async () => {
    // If on mobile and modal is not open, open it first to give options
    if (isMobile) {
      setIsModalOpen(true);
      return;
    }
    
    // Otherwise try direct extension trigger
    await triggerStacksConnect();
  };

  const triggerStacksConnect = async () => {
    const session = await getStacksSession();
    if (!session) return;
    const { showConnect: sc } = await import("@stacks/connect");
    sc({
      appDetails: {
        name: 'Ironclad',
        icon: window.location.origin + '/assets/logo.png',
      },
      redirectTo: '/onboarding',
      onFinish: () => {
        window.location.reload();
      },
      userSession: session,
    });
  };

  const disconnectStacks = async () => {
    const session = await getStacksSession().catch(() => null);
    if (session) session.signUserOut();
    setState({
      hasWallet: false,
      isUnlocked: false,
      isLoading: false,
      address: null,
      balance: 0,
      walletType: null,
      userName: null,
      network: 'testnet',
      isInitialized: false,
    });
  };

  const updateProfile = async (name: string) => {
    await db.settings.put({ key: 'userName', value: name });
    setState(prev => ({ ...prev, userName: name, isInitialized: true }));
  };

  const setNetworkMode = async (mode: 'mainnet' | 'testnet') => {
    await db.settings.put({ key: 'network', value: mode });
    setState(prev => ({ ...prev, network: mode }));
    // In a real app, we might need to re-derive addresses or clear cache here
  };

  const createWallet = async (password: string, name?: string): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const BW = await getBitcoinWallet();
      const mnemonic = BW.generateMnemonic();
      
      const salt = CryptoService.generateSalt();
      const key = await CryptoService.deriveKey(password, salt);
      const { cyphertext, iv } = await CryptoService.encrypt(mnemonic, key);
      
      const encryptedMnemonicBase64 = CryptoService.arrayBufferToBase64(cyphertext);
      const saltBase64 = CryptoService.arrayBufferToBase64(salt);
      const ivBase64 = CryptoService.arrayBufferToBase64(iv);

      // Store in DB only once
      await db.wallets.clear();
      await db.wallets.add({
        name: name || "Main",
        encryptedMnemonic: encryptedMnemonicBase64,
        salt: saltBase64,
        iv: ivBase64,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });

      if (name) {
          await db.settings.put({ key: 'userName', value: name });
      }

      // Unlock immediately
      const walletKeys = BW.fromMnemonic(mnemonic);
      setKeys(walletKeys);
      
      setState(prev => ({ 
        ...prev, 
        hasWallet: true, 
        isUnlocked: true, 
        isLoading: false,
        address: walletKeys.address,
        balance: 0,
        userName: name || null,
        isInitialized: !!name
      }));
      
      return mnemonic;
    } catch (err) {
      console.error("Create wallet failed:", err);
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const restoreWallet = async (mnemonic: string, password: string, name?: string) => {
    try {
      const BW = await getBitcoinWallet();
      if (!BW.validateMnemonic(mnemonic)) {
        throw new Error("Invalid mnemonic phrase");
      }

      setState(prev => ({ ...prev, isLoading: true }));
      
      const salt = CryptoService.generateSalt();
      const key = await CryptoService.deriveKey(password, salt);
      const { cyphertext, iv } = await CryptoService.encrypt(mnemonic, key);
      
      const encryptedMnemonicBase64 = CryptoService.arrayBufferToBase64(cyphertext);
      const saltBase64 = CryptoService.arrayBufferToBase64(salt);
      const ivBase64 = CryptoService.arrayBufferToBase64(iv);

      await db.wallets.clear();
      await db.wallets.add({
        name: name || "Restored",
        encryptedMnemonic: encryptedMnemonicBase64,
        salt: saltBase64,
        iv: ivBase64,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });

      if (name) {
        await db.settings.put({ key: 'userName', value: name });
      }

      const walletKeys = BW.fromMnemonic(mnemonic);
      setKeys(walletKeys);
      
      setState(prev => ({ 
        ...prev, 
        hasWallet: true, 
        isUnlocked: true, 
        isLoading: false,
        address: walletKeys.address,
        balance: 0,
        userName: name || null,
        isInitialized: !!name
      }));
    } catch (err) {
      console.error("Restore wallet failed:", err);
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const unlockWallet = async (password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const walletRecord = await db.wallets.orderBy('lastUsed').last();
      
      if (!walletRecord) {
        setState(prev => ({ ...prev, hasWallet: false, isLoading: false }));
        return false;
      }
      
      const salt = CryptoService.base64ToArrayBuffer(walletRecord.salt);
      const iv = CryptoService.base64ToArrayBuffer(walletRecord.iv);
      const cyphertext = CryptoService.base64ToArrayBuffer(walletRecord.encryptedMnemonic);
      
      try {
        const key = await CryptoService.deriveKey(password, new Uint8Array(salt));
        const mnemonic = await CryptoService.decrypt(cyphertext, key, new Uint8Array(iv));
        
        const BW = await getBitcoinWallet();
        if (!BW.validateMnemonic(mnemonic)) {
           throw new Error("Invalid mnemonic after decryption");
        }
        
        // Derive keys
        const walletKeys = BW.fromMnemonic(mnemonic); 
        setKeys(walletKeys);

        // Fetch balance
        const balance = await BitcoinClient.getBalance(walletKeys.address);
        
        setState(prev => ({
          ...prev,
          hasWallet: true,
          isUnlocked: true,
          isLoading: false,
          address: walletKeys.address,
          balance: balance, 
        }));
        
        return true;
      } catch (decryptionError) {
        console.error("Decryption failed:", decryptionError);
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
    } catch (err) {
      console.error("Unlock failed:", err);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const lockWallet = () => {
    setKeys(null);
    setState(prev => ({ 
      ...prev, 
      isUnlocked: false, 
      address: null, 
      balance: 0 
    }));
  };

  const deleteWallet = async () => {
    await db.wallets.clear();
    await db.settings.clear();
    await db.transactions.clear();
    await db.users.clear();
    if ((db as any).notifications) await (db as any).notifications.clear();
    
    lockWallet();
    setState(prev => ({ ...prev, hasWallet: false, userName: null, isInitialized: false }));
  };

  return (
    <WalletContext.Provider value={{
      ...state, 
      createWallet, 
      restoreWallet, 
      unlockWallet, 
      lockWallet,
      deleteWallet,
      connectStacks,
      disconnectStacks,
      updateProfile,
      setNetworkMode,
      openWalletModal
    }}>
      {children}
      <WalletSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnectExtension={() => {
          setIsModalOpen(false);
          triggerStacksConnect();
        }}
      />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
