"use client";

import { useState } from "react";
import { useWallet } from "@/providers/WalletProvider";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, Shield } from "lucide-react";

export function UnlockWallet() {
  const { unlockWallet, isLoading } = useWallet();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setError("");
    const success = await unlockWallet(password);
    if (!success) {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-delayed" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-glass border border-glass-border mb-4 glow-node">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-tight text-white mb-2">Welcome Back</h1>
          <p className="text-muted-silver">
            Enter your password to unlock your vault.
          </p>
        </div>

        {/* Unlock Card */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <form onSubmit={handleUnlock} className="flex flex-col gap-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm flex items-center gap-2"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-silver uppercase tracking-wider ml-1 mb-1.5 block">
                Vault Password
              </label>
              <div className="relative group">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-darker/50 border border-border-subtle hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-surface-lighter outline-none transition-all"
                  placeholder="••••••••••••"
                  autoFocus
                  disabled={isLoading}
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

            <button 
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Vault
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border-subtle text-center">
            <p className="text-xs text-muted-silver">
              Forgot password? <br />
              <span className="text-surface-lighter italic">Vault passwords cannot be recovered without your 12-word phrase.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-muted-silver">
          Not your vault? {' '}
          <button 
            onClick={() => window.location.reload()} // Simplified clear/switch logic
            className="text-primary font-bold hover:underline"
          >
            Switch Account
          </button>
        </p>
      </motion.div>
    </div>
  );
}
