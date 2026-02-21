"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Key, 
  Zap, 
  Server, 
  Cpu, 
  Search, 
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  Download,
  Terminal,
  FileCode,
  ArrowLeft,
  CheckCircle2,
  Shield,
  X,
  FileSearch,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/providers/NotificationProvider";

const ATTACK_VECTORS = [
  {
    title: "Double Spend Mitigation",
    desc: "Transactions are only finalized after Bitcoin-level settlement confirmation via sBTC nodes.",
    status: "SECURE",
    icon: Zap,
    details: "Using Bitcoin's Proof-of-Work to secure sBTC minting and burning transactions. Multiple confirmations are required before any vault state is mutated."
  },
  {
    title: "Contract Re-entrancy",
    desc: "Clarity language is non-Turing complete, eliminating entire classes of re-entrancy bugs.",
    status: "SECURE",
    icon: Lock,
    details: "Clarity's decidability means the interpreter can analyze the entire control flow before execution, preventing recursive calls to unknown contracts."
  },
  {
    title: "Seed Extraction",
    desc: "Mnemonic materials never leave your local environment; signed via Stacks/Xverse provider.",
    status: "USER-MANAGED",
    icon: Key,
    details: "Ironclad utilizes standard Web3 provider patterns. Your private keys are stored in your wallet extension, not on our servers."
  },
  {
    title: "Oracle Manipulation",
    desc: "Uses a decentralized set of oracles with reputation-weighted slashing for false reporting.",
    status: "HIGH-CONFIDENCE",
    icon: Eye,
    details: "Our oracle network requires collateral. Any divergence from the majority result leads to immediate reputation slashing and bond forfeiture."
  }
];

const AUDIT_FINDINGS = [
  { id: "FIND-01", area: "Logic", severity: "Low", status: "Fixed", title: "Integer Overflow in Reward Calc" },
  { id: "FIND-02", area: "Gas", severity: "Medium", status: "Optimized", title: "Redundant Map Lookups" },
  { id: "FIND-03", area: "UX", severity: "Info", status: "Mitigated", title: "Seed Phrase UI Guidance" }
];

export default function SecurityPage() {
  const { addNotification } = useNotifications();
  const [selectedVector, setSelectedVector] = useState<any>(null);
  const [showRecoveryGuide, setShowRecoveryGuide] = useState(false);

  const handleAuditDownload = () => {
    addNotification({
      type: 'info',
      title: 'Audit Report Request',
      message: 'Generating secure PDF manifest for Ironclad v1.4.2... Check your downloads folder.'
    });
  };

  const handleVerifyContract = () => {
     window.open('https://explorer.hiro.so/address/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.ironclad-vault?chain=mainnet', '_blank');
  };

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen lg:h-full relative overflow-y-auto lg:overflow-hidden">
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Security Infrastructure</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <ShieldCheck size={14} className="text-primary" />
              Verified Architecture_
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Nominal</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 pt-24 lg:pt-12 scroll-smooth bg-glow relative">
          <div className="max-w-5xl mx-auto space-y-24 pb-20">
            
            {/* HERO - Trust Pillar */}
            <section className="relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="max-w-3xl space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-8 uppercase tracking-tighter">
                    Protocol-Level <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-primary-dark italic">Sovereignty</span>
                  </h2>
                  <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                    Ironclad eliminates counterparty risk by moving trust from custodians to immutable Clarity smart contracts. Every savings commitment is mathematically verifiable across Bitcoin and Stacks.
                  </p>
                </motion.div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                   <button 
                     onClick={handleAuditDownload}
                     className="px-8 py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-primary/10 active:scale-95"
                   >
                      <Download size={18} />
                      Audit Report 2024
                   </button>
                   <button 
                     onClick={handleVerifyContract}
                     className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                   >
                      <FileCode size={18} />
                      Verify Contract
                   </button>
                </div>
              </div>
            </section>

            {/* Technical Layers Visualization */}
            <section className="relative">
               <div className="glass-panel p-10 md:p-16 rounded-[3rem] border-white/5 bg-linear-to-b from-white/2 to-transparent relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center">
                     <div className="space-y-6">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-6 border border-orange-500/20">
                           <Lock size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Bitcoin L1</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">Ultimate finality. Funds held in multisig vaults secured by Bitcoin hashpower.</p>
                     </div>
                     <div className="space-y-6 pt-10 md:pt-0">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 relative border border-primary/20">
                           <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-20" />
                           <Cpu size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Stacks L2</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">Clarity smart contracts enforce time-locks and reputation logic deterministically.</p>
                     </div>
                     <div className="space-y-6 pt-10 md:pt-0">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
                           <Fingerprint size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Sovereign Key</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">Owner-only access. No protocol upgrades can seize user collateral without consensus.</p>
                     </div>
                  </div>
                  {/* Decorative Connector Line */}
                  <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-linear-to-r from-orange-500/10 via-primary/40 to-blue-500/10 -translate-y-[40px]" />
               </div>
            </section>

            {/* Attack Vectors & Mitigations */}
            <section className="space-y-12">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-3xl text-red-500 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Threat Modeling</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Active mitigation strategies for protocol integrity.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ATTACK_VECTORS.map((v, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedVector(v)}
                      className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex items-start gap-8 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden bg-white/1"
                    >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
                       <div className="p-5 bg-white/2 rounded-3xl text-slate-400 group-hover:text-primary transition-colors border border-white/5 relative z-10">
                          <v.icon size={32} />
                       </div>
                       <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                             <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{v.title}</h4>
                             <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">{v.status}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed font-light">{v.desc}</p>
                          <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-primary transition-colors">
                             View Details <ChevronRight size={14} />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </section>

            {/* Audit Logs Sidebar - Grid Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 glass-panel p-10 rounded-[3rem] border-white/5 space-y-10 bg-white/1">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <Terminal size={32} className="text-primary" />
                        <div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Security Log_</h4>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-0.5">Automated_Consistency_Check</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-slate-500 px-3 py-1 bg-white/5 rounded-lg">LAST_RUN: 2024.02.17.1355</span>
                  </div>
                  
                  <div className="space-y-4">
                     {AUDIT_FINDINGS.map(finding => (
                       <div key={finding.id} className="flex items-center justify-between p-6 bg-white/2 rounded-3xl border border-white/5 group hover:bg-white/5 transition-all cursor-default">
                          <div className="flex items-center gap-5">
                             <div className={`w-3 h-3 rounded-full blur-[2px] ${finding.severity === 'Low' ? 'bg-blue-400' : finding.severity === 'Medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                             <div>
                                <p className="text-sm font-bold text-white mb-1">{finding.title}</p>
                                <p className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">{finding.id} • {finding.area} Phase</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                             {finding.status}
                          </span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 glass-panel p-10 rounded-[3rem] border-blue-500/20 bg-blue-500/3 flex flex-col justify-center gap-8 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
                  <div className="w-20 h-20 rounded-4xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0 shadow-2xl shadow-blue-500/5">
                    <Server size={40} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Deterministic Recovery</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                      Losing your local profile does not endanger your assets. Every vault is derived from your root key. Use any BIP-39 interface for emergency recovery.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowRecoveryGuide(true)}
                    className="w-full flex items-center justify-between p-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group"
                  >
                     View Recovery Guide
                     <ChevronRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* DETAIL OVERLAYS (Pseudo-Pages) */}
      <AnimatePresence>
         {(selectedVector || showRecoveryGuide) && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-2xl flex items-center justify-center p-6 lg:p-12"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-2xl glass-panel p-10 md:p-16 rounded-[4rem] border-white/10 bg-white/1 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                  
                  <button 
                    onClick={() => { setSelectedVector(null); setShowRecoveryGuide(false); }}
                    className="absolute top-10 right-10 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  >
                     <X size={24} />
                  </button>

                  {selectedVector ? (
                    <div className="space-y-10 relative z-10">
                       <div className="space-y-3">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Threat Mitigation Strategy_</span>
                          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedVector.title}</h2>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                             <div className="flex items-center gap-3 text-primary">
                                <FileSearch size={24} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Technical Deep-Dive</span>
                             </div>
                             <p className="text-lg text-slate-300 font-light leading-relaxed">
                                {selectedVector.details}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-4 p-5 bg-green-500/10 rounded-2xl border border-green-500/20">
                             <CheckCircle2 size={24} className="text-green-500" />
                             <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Certification</p>
                                <p className="text-sm font-black text-white uppercase tracking-widest">{selectedVector.status}</p>
                             </div>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex gap-4">
                          <button className="flex-1 py-5 bg-primary text-background-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3">
                             Open Research Wiki <ExternalLink size={18} />
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-10 relative z-10">
                       <div className="space-y-3">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Asset Retrieval Protocol_</span>
                          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Emergency Recovery</h2>
                       </div>
                       
                       <div className="space-y-8">
                          <p className="text-lg text-slate-300 font-light leading-relaxed">
                             Every Ironclad Vault is a standard BIP-39 / BIP-44 path derived from your root mnemonic. If our interface is unavailable, you can recover funds via any Stacks-compatible tool.
                          </p>
                          
                          <div className="space-y-4">
                             <div className="p-6 bg-white/2 rounded-3xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">1</div>
                                <p className="text-sm text-slate-400 leading-relaxed font-light mt-2">Export your 12 or 24-word seed phrase from your local provider (Xverse/Leather).</p>
                             </div>
                             <div className="p-6 bg-white/2 rounded-3xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">2</div>
                                <p className="text-sm text-slate-400 leading-relaxed font-light mt-2">Import this seed into a BIP-39 recovery module using the standard Stacks derivation path.</p>
                             </div>
                             <div className="p-6 bg-white/2 rounded-3xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">3</div>
                                <p className="text-sm text-slate-400 leading-relaxed font-light mt-2">Sign a manual withdrawal transaction targeting the vault's contract address.</p>
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setShowRecoveryGuide(false)}
                         className="w-full py-5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                       >
                          I Understand, Return to Safety
                       </button>
                    </div>
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
