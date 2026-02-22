"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  Smartphone, 
  Laptop, 
  ArrowRight,
  ExternalLink,
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  desktopLink?: string;
  mobileLink: string; // Deep link or Universal Link
  storeLink: {
    ios: string;
    android: string;
  };
  supported: boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'xverse',
    name: 'Xverse Wallet',
    icon: 'https://www.xverse.app/favicons/favicon-32x32.png',
    description: 'The most popular Bitcoin & Stacks wallet for mobile.',
    mobileLink: `https://www.xverse.app/browser?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`,
    storeLink: {
      ios: 'https://apps.apple.com/app/xverse-bitcoin-wallet/id1552272513',
      android: 'https://play.google.com/store/apps/details?id=com.identi.xverse'
    },
    supported: true
  },
  {
    id: 'leather',
    name: 'Leather (Hiro)',
    icon: 'https://leather.io/favicon.ico',
    description: 'Professional-grade Stacks wallet. Mobile beta available.',
    mobileLink: 'leather://', // Placeholder for deep link if available
    storeLink: {
      ios: 'https://leather.io/download',
      android: 'https://leather.io/download'
    },
    supported: true
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: 'https://static.okx.com/cdn/assets/imgs/221/9E9A68369D439775.png',
    description: 'Universal crypto wallet with Stacks L2 support.',
    mobileLink: 'okx://wallet/dapp/details?dappUrl=' + (typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''),
    storeLink: {
      ios: 'https://apps.apple.com/app/okx-buy-bitcoin-ether-crypto/id1327268470',
      android: 'https://play.google.com/store/apps/details?id=com.okinc.okex.gp'
    },
    supported: true
  }
];

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectExtension: () => void;
}

export function WalletSelectionModal({ isOpen, onClose, onConnectExtension }: WalletSelectionModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [browserType, setBrowserType] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobile = /iPhone|iPad|iPod|Android/i.test(ua);
    setIsMobile(mobile);
    
    if (/iPhone|iPad|iPod/i.test(ua)) setBrowserType('ios');
    else if (/Android/i.test(ua)) setBrowserType('android');
  }, []);

  const handleWalletSelect = (wallet: WalletOption) => {
    if (isMobile) {
      // Logic for mobile connection:
      // Try to open the app via deep link.
      // If it fails (after a short delay), redirect to the store.
      
      const start = Date.now();
      const timeout = 2500;
      
      window.location.href = wallet.mobileLink;
      
      setTimeout(() => {
        if (Date.now() - start < timeout + 100) {
          // If we are still here, the app probably didn't open
          const storeUrl = browserType === 'ios' ? wallet.storeLink.ios : wallet.storeLink.android;
          window.location.href = storeUrl;
        }
      }, timeout);
    } else {
      // On desktop, we prefer the extension
      onConnectExtension();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background-dark/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-[480px] bg-white/1 border border-white/10 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden glass-panel"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Connect Wallet</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    {isMobile ? 'Select a Mobile App' : 'Browser Extension detected'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Device Context Info */}
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="text-primary shrink-0">
                  {isMobile ? <Smartphone size={18} /> : <Laptop size={18} />}
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {isMobile 
                    ? "We'll redirect you to your chosen wallet app. If not installed, you'll be sent to the App Store."
                    : "For the best experience on desktop, we recommend the Leather or Xverse browser extensions."}
                </p>
              </div>

              {/* Wallet List */}
              <div className="space-y-3">
                {WALLET_OPTIONS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet)}
                    className="w-full group p-5 bg-white/2 border border-white/5 rounded-3xl flex items-center gap-5 hover:bg-white/5 hover:border-primary/30 transition-all text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 blur-3xl rounded-full group-hover:bg-primary/5 transition-colors" />
                    <div className="w-14 h-14 rounded-2xl bg-white/5 p-3 flex items-center justify-center border border-white/10 relative z-10 transition-transform group-hover:scale-105">
                      <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">{wallet.name}</h4>
                        {isMobile && <Smartphone size={14} className="text-slate-600 group-hover:text-primary" />}
                      </div>
                      <p className="text-[11px] text-slate-500 font-light leading-snug group-hover:text-slate-400 transition-colors">{wallet.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:border-primary/50 transition-all">
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              {!isMobile && (
                <button
                  onClick={onConnectExtension}
                  className="w-full py-5 bg-primary text-background-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 active:scale-95"
                >
                  <ShieldCheck size={18} />
                  Default Browser Extension
                </button>
              )}

              <div className="pt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-primary" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Non-Custodial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-primary" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Support Message */}
            <div className="p-6 bg-white/2 border-t border-white/5 flex items-center justify-center gap-3">
              <Info size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Need help? <button className="text-primary hover:underline">View Connectivity Guide</button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
