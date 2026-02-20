"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useWallet } from "@/providers/WalletProvider";
import { useContract } from "@/hooks/useContract";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export default function CommitmentsPage() {
  const { address, walletType, network: networkMode } = useWallet();
  const { getPlan, getBlockHeight } = useContract();
  const [plan, setPlan] = useState<any>(null);
  const [blockHeight, setBlockHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (address && walletType === 'stacks') {
      const [p, h] = await Promise.all([getPlan(address), getBlockHeight()]);
      if (p?.value) setPlan(p.value);
      setBlockHeight(h);
    }
    setLoading(false);
  }, [address, walletType, getPlan, getBlockHeight]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Active Commitments</h1>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">On-chain protocol rules</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            {loading ? (
              <div className="flex justify-center p-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : plan ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                      ENFORCED
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div>
                          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Target Amount</p>
                          <p className="text-4xl font-mono font-bold text-white">{(Number(plan['target-amount'].value) / 100000000).toFixed(8)} <span className="text-lg text-primary">BTC</span></p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Savings Address (Stacks)</p>
                          <p className="text-xs font-mono text-slate-300 break-all bg-white/5 p-3 rounded border border-white/5">{address}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="flex-1 p-4 rounded-xl bg-white/2 border border-white/5">
                              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Start Height</p>
                              <p className="text-white font-mono">{plan['start-height'].value}</p>
                           </div>
                           <div className="flex-1 p-4 rounded-xl bg-white/2 border border-white/5">
                              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Duration</p>
                              <p className="text-white font-mono">{plan.duration.value} Blocks</p>
                           </div>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                           <p className="text-primary text-[10px] uppercase font-bold mb-1">Release Condition</p>
                           <p className="text-sm text-slate-200 leading-relaxed">
                             Vault funds are globally locked until block <span className="text-white font-bold">#{Number(plan['start-height'].value) + Number(plan.duration.value)}</span>.
                             Early withdrawal incurs a penalty.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-xl border-l-4 border-l-blue-500">
                     <h4 className="text-white font-bold text-sm mb-2">Protocol Fee</h4>
                     <p className="text-2xl font-mono text-white">0.5%</p>
                     <p className="text-[10px] text-slate-500 mt-2">Paid on success</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-l-4 border-l-red-500">
                     <h4 className="text-white font-bold text-sm mb-2">Penalty Basis</h4>
                     <p className="text-2xl font-mono text-white">10%</p>
                     <p className="text-[10px] text-slate-500 mt-2">If rules broken</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-l-4 border-l-green-500">
                     <h4 className="text-white font-bold text-sm mb-2">Network</h4>
                     <p className="text-2xl font-mono text-white uppercase">{networkMode}</p>
                     <p className="text-[10px] text-slate-500 mt-2">Stacks Layer 2</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
                 <span className="material-icons text-6xl text-slate-700">assignment_late</span>
                 <h2 className="text-xl font-bold text-white">No Active Commitment</h2>
                 <p className="text-slate-500">You haven't initialized a savings rule yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
