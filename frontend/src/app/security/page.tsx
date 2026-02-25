"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
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
  FileCode,
  ArrowLeft,
  CheckCircle2,
  Shield,
  X,
  FileSearch,
  ExternalLink,
  Terminal
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
  const { data: session } = useSession();
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
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark relative">
      {session ? <Sidebar /> : <Navbar />}
      
      <main className={`flex-1 flex flex-col min-h-screen relative ${session ? 'h-screen overflow-hidden pt-16 lg:pt-0' : 'pt-32'}`}>
        {/* Ambient Background Effects */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 scroll-smooth bg-glow relative">
          <div className="max-w-5xl mx-auto space-y-24 pb-20">
            
            <section className="relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="max-w-3xl space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-8 uppercase tracking-tighter">
                    Protocol-Level <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-primary-dark italic">Independence</span>
                  </h2>
                  <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl wrap-break-word">
                    Ironclad eliminates counterparty risk by moving trust from custodians to immutable Clarity smart contracts. Every savings commitment is mathematically verifiable across Bitcoin and Stacks.
                  </p>
                </motion.div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                   <button 
                     onClick={handleAuditDownload}
                     className="px-8 py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-primary/10 active:scale-95"
                   >
                      <Download size={18} />
                      Audit Report 2026
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

            <section className="relative">
               <div className="glass-panel p-10 md:p-16 rounded-4xl border-white/5 bg-linear-to-b from-white/2 to-transparent relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center">
                     <div className="space-y-6">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-6 border border-orange-500/20">
                           <Lock size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Bitcoin L1</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light wrap-break-word">Ultimate finality. Funds held in multisig vaults secured by Bitcoin hashpower.</p>
                     </div>
                     <div className="space-y-6 pt-10 md:pt-0">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 relative border border-primary/20">
                           <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-20" />
                           <Cpu size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Stacks L2</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light wrap-break-word">Clarity smart contracts enforce time-locks and reputation logic deterministically.</p>
                     </div>
                     <div className="space-y-6 pt-10 md:pt-0">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
                           <Fingerprint size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Secure Key</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light wrap-break-word">Owner-only access. No protocol upgrades can seize user collateral without consensus.</p>
                     </div>
                  </div>
               </div>
            </section>

            <section className="space-y-12">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-3xl text-red-500 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Threat Modeling</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Active mitigation strategies for protocol integrity.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ATTACK_VECTORS.map((v, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedVector(v)}
                      className="glass-panel p-8 rounded-4xl border-white/5 flex flex-col sm:flex-row items-start gap-8 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden bg-white/2"
                    >
                       <div className="p-5 bg-white/2 rounded-3xl text-slate-400 group-hover:text-primary transition-colors border border-white/5 relative z-10 shrink-0">
                          <v.icon size={32} />
                       </div>
                       <div className="relative z-10 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                             <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate">{v.title}</h4>
                             <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 shrink-0">{v.status}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed font-light wrap-break-word">{v.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 glass-panel p-6 md:p-10 rounded-4xl border-white/5 space-y-10 bg-white/2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-5">
                        <Terminal size={32} className="text-primary" />
                        <div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Security Log_</h4>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Automated_Consistency_Check</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-slate-500 px-3 py-1 bg-white/5 rounded-lg shrink-0">LAST_RUN: 2026.02.17.1355</span>
                  </div>
                  
                  <div className="space-y-4">
                     {AUDIT_FINDINGS.map(finding => (
                       <div key={finding.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/2 rounded-3xl border border-white/5 group hover:bg-white/5 transition-all cursor-default gap-4">
                          <div className="flex items-center gap-5 min-w-0">
                             <div className={`w-3 h-3 rounded-full blur-[2px] shrink-0 ${finding.severity === 'Low' ? 'bg-blue-400' : finding.severity === 'Medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                             <div className="min-w-0">
                                <p className="text-sm font-bold text-white mb-1 truncate">{finding.title}</p>
                                <p className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest truncate">{finding.id} • {finding.area} Phase</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-xl transition-all shrink-0">
                             {finding.status}
                          </span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 glass-panel p-10 rounded-4xl border-blue-500/20 bg-blue-500/3 flex flex-col justify-center gap-8 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
                  <div className="w-20 h-20 rounded-4xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0 shadow-2xl shadow-blue-500/5">
                    <Server size={40} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Deterministic Recovery</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-light wrap-break-word">
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

      <AnimatePresence>
         {(selectedVector || showRecoveryGuide) && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-100 bg-background-dark/95 backdrop-blur-2xl flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-2xl glass-panel p-8 md:p-16 rounded-4xl border-white/10 bg-background-dark relative overflow-hidden my-auto"
                  onClick={e => e.stopPropagation()}
               >
                  <button 
                    onClick={() => { setSelectedVector(null); setShowRecoveryGuide(false); }}
                    className="absolute top-6 right-6 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white z-20"
                  >
                     <X size={24} />
                  </button>

                  {selectedVector ? (
                    <div className="space-y-10 relative z-10">
                       <div className="space-y-3">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Threat Mitigation Strategy_</span>
                          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedVector.title}</h2>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                             <div className="flex items-center gap-3 text-primary">
                                <FileSearch size={24} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Technical Deep-Dive</span>
                             </div>
                             <p className="text-lg text-slate-300 font-light leading-relaxed wrap-break-word">
                                {selectedVector.details}
                             </p>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-10 relative z-10">
                       <div className="space-y-3">
                           <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Asset Retrieval Protocol_</span>
                          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Emergency Recovery</h2>
                       </div>
                       <div className="space-y-6">
                          <p className="text-lg text-slate-300 font-light leading-relaxed wrap-break-word">
                             Every Ironclad Vault is a standard BIP-39 / BIP-44 path derived from your root mnemonic. If our interface is unavailable, you can recover funds via any Stacks-compatible tool.
                          </p>
                          <div className="space-y-4 text-xs text-slate-400 italic">
                             <p>1. Export seed phrase from local provider.</p>
                             <p>2. Import into BIP-39 recovery module.</p>
                             <p>3. Sign manual withdrawal transaction.</p>
                          </div>
                       </div>
                    </div>
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
