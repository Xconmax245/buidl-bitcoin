"use client";

import { useState } from "react";
import { useWallet } from "@/providers/WalletProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Plus, 
  RotateCcw, 
  ArrowRight, 
  Chrome, 
  Wallet as WalletIcon, 
  Lock, 
  Copy, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  X,
  User,
  Zap,
  Clock,
  TrendingUp,
  Eye,
  EyeOff
} from "lucide-react";

export function CreateWallet({ onComplete }: { onComplete: () => void }) {
  const { createWallet, restoreWallet, isLoading, connectStacks } = useWallet();
  const [step, setStep] = useState<'intro' | 'profile' | 'password' | 'backup' | 'restore'>('intro');
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>([]);
  const [restoreMnemonic, setRestoreMnemonic] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleCreate = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }
    
    try {
      const mnemonic = await createWallet(password, name || "Main Vault");
      setMnemonicPhrase(mnemonic.split(' '));
      setStep('backup');
    } catch (err) {
      setError("Failed to create vault");
      console.error(err);
    }
  };

  const handleRestore = async () => {
    if (!restoreMnemonic.trim() || !password) {
        setError("Please enter mnemonic and password");
        return;
    }
    
    try {
        await restoreWallet(restoreMnemonic.trim(), password, name || "Restored Vault");
        onComplete();
    } catch (err) {
        setError("Failed to restore vault. Check mnemonic.");
        console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonicPhrase.join(' '));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-delayed" />

      <motion.div 
        layout
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-glass border border-glass-border mb-8 glow-node">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold font-tight text-white mb-3">Ironclad Vault</h1>
              <p className="text-muted-silver mb-10 max-w-xs mx-auto text-lg">
                Secure, non-custodial Bitcoin savings without complexity.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setStep('password')}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-black font-bold text-lg transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-3 group"
                >
                  <Plus size={22} />
                  Create New Vault
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-1" />
                </button>
                
                <button 
                  onClick={() => setStep('restore')}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-border-subtle text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw size={20} />
                  Restore Existing 
                </button>
              </div>

              <div className="flex items-center my-8 gap-4 px-4">
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="text-[10px] font-bold text-surface-lighter uppercase tracking-widest whitespace-nowrap">Or connect with</span>
                <div className="flex-1 h-px bg-border-subtle" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={connectStacks}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-border-subtle hover:bg-white/10 hover:border-primary/30 transition-all rounded-xl py-3 text-sm font-medium text-white"
                >
                  <img src="https://assets.coingecko.com/coins/images/2069/small/Stacks_Logo_png.png" alt="Stacks" className="w-5 h-5" />
                  Stacks
                </button>
                <button 
                  onClick={() => console.log('Google Auth')}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-border-subtle hover:bg-white/10 hover:border-primary/30 transition-all rounded-xl py-3 text-sm font-medium text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Google
                </button>
              </div>
            </motion.div>
          )}

          {step === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Secure Your Vault</h2>
                <p className="text-muted-silver">This password encrypts your keys locally.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-silver uppercase tracking-wider ml-1 mb-1.5 block">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-darker/50 border border-border-subtle hover:border-primary/50 focus:border-primary rounded-xl py-3.5 pl-11 pr-12 text-white outline-none transition-all"
                      placeholder="Min 8 characters"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-silver hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-silver uppercase tracking-wider ml-1 mb-1.5 block">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Check className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-surface-darker/50 border border-border-subtle hover:border-primary/50 focus:border-primary rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs px-1 text-center font-medium">{error}</p>}

                <button 
                  onClick={handleCreate}
                  disabled={isLoading || !password || password.length < 8}
                  className="w-full py-4 rounded-xl bg-primary text-black font-bold transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Vault
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button onClick={() => setStep('intro')} className="w-full text-muted-silver text-xs hover:text-white">Back</button>
              </div>
            </motion.div>
          )}

          {step === 'restore' && (
            <motion.div
              key="restore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Restore Vault</h2>
                <p className="text-muted-silver">Enter your 12-word Secret Recovery Phrase.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={restoreMnemonic}
                    onChange={(e) => setRestoreMnemonic(e.target.value)}
                    className="w-full h-32 bg-surface-darker/50 border border-border-subtle rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary outline-none transition-colors resize-none mb-2"
                    placeholder="apple banana cat dog..."
                  />
                  <div className="absolute right-3 bottom-5 text-surface-lighter">
                    <RotateCcw size={16} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-darker/50 border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-surface-lighter outline-none"
                      placeholder="New Password (Min 8 characters)"
                    />
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-xs px-1 text-center font-medium">{error}</p>}

                <button 
                  onClick={handleRestore}
                  disabled={isLoading || !password || !restoreMnemonic}
                  className="w-full py-4 rounded-xl bg-primary text-black font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? "Restoring..." : "Restore Vault"}
                </button>
                <button onClick={() => setStep('intro')} className="w-full text-muted-silver text-xs hover:text-white">Cancel</button>
              </div>
            </motion.div>
          )}

          {step === 'backup' && (
            <motion.div
              key="backup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-4">Recovery Phrase</h2>
                <p className="text-muted-silver text-sm mb-8 leading-relaxed">
                  Write down these 12 words in order. <br />
                  <span className="text-primary font-bold">This is your ONLY key to your funds.</span>
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {mnemonicPhrase.map((word, i) => (
                    <div key={i} className="bg-surface-darker/80 border border-border-subtle rounded-xl p-3 text-center relative group">
                      <span className="absolute top-1 left-1.5 text-[8px] text-surface-lighter opacity-50">{i + 1}</span>
                      <span className="text-white text-xs font-mono font-bold tracking-tight">{word}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-all bg-primary/5 px-4 py-2 rounded-full mb-8"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? 'Copied' : 'Copy Words'}
                </button>

                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8 text-left flex gap-4">
                  <AlertTriangle className="text-primary shrink-0" size={20} />
                  <p className="text-primary/90 text-[11px] leading-relaxed font-medium">
                    If you lose these words, your Bitcoin is lost forever. We cannot recover it. Never share this with anyone.
                  </p>
                </div>

                <button 
                  onClick={onComplete}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-white text-black font-bold transition-all shadow-xl shadow-primary/20"
                >
                  I've Secured My Phrase
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Help Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setShowGuide(true)}
          className="group flex items-center gap-2 bg-glass backdrop-blur-md border border-glass-border text-primary px-5 py-4 rounded-2xl hover:bg-primary hover:text-black transition-all duration-300 shadow-xl"
        >
          <HelpCircle size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">Guide</span>
        </button>
      </div>

      {/* Guide Overlay */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full glass-panel p-10 rounded-3xl border border-glass-border relative"
            >
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-8 right-8 text-muted-silver hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-bold font-tight text-white mb-10 flex items-center gap-4">
                <Zap className="text-primary" size={32} />
                The Saving Journey
              </h2>

              <div className="space-y-10">
                {[
                  { title: "Initialize Vault", desc: "Create your unique Bitcoin identity. It stays encrypted on this device and can be moved anywhere with your phrase.", icon: WalletIcon },
                  { title: "Commit BTC", desc: "Lock your sBTC or BTC into rule-based contracts. No middlemen, just pure Bitcoin security.", icon: Lock },
                  { title: "Earn standing", desc: "Successfully completing savings build your reputation score, unlocking lower fees and higher protocol tiers.", icon: TrendingUp },
                  { title: "Protocol Safety", desc: "Funds are secured by Bitcoin's finality. You define the rules; the blockchain enforces them.", icon: Shield }
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                      <s.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold mb-1.5 flex items-center gap-3">
                        <span className="text-primary font-mono text-sm leading-none opacity-50">0{idx + 1}</span>
                        {s.title}
                      </h3>
                      <p className="text-muted-silver text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowGuide(false)}
                className="w-full mt-12 py-5 rounded-2xl bg-primary text-black font-bold text-lg hover:bg-white transition-all active:scale-[0.98]"
              >
                Let's Build Wealth
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
