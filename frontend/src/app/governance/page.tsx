"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileText, 
  Vote, 
  Users, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  BarChart3,
  Gavel,
  Activity
} from "lucide-react";

// Mock Proposals Data
const PROPOSALS = [
  {
    id: "IRP-042",
    title: "Increase Maximum Lock Duration to 5 Years",
    desc: "A proposal to extend the deterministic time-lock capability beyond the current 3-year limit to accommodate ultra-long-term institutional holders.",
    status: "ACTIVE",
    votes: { for: 89200, against: 12400 },
    quorum: 75,
    timeLeft: "2d 4h",
    category: "Economic",
    proposer: "SP3...4X2"
  },
  {
    id: "IRP-041",
    title: "Reduce Minimum Penalty Threshold to 5%",
    desc: "Lowering the early-withdrawal penalty for 'Strategic' tier commitments to increase protocol flexibility while maintaining economic security.",
    status: "ACTIVE",
    votes: { for: 45000, against: 32100 },
    quorum: 62,
    timeLeft: "5h 12m",
    category: "Economic",
    proposer: "SP1...9Q7"
  },
  {
    id: "IRP-040",
    title: "Add Support for Native sBTC Liquid Staking",
    desc: "Integration with Bitcoin Layer-2 liquid staking providers to allow users to maintain liquidity while assets are locked in the Ironclad vault.",
    status: "REJECTED",
    votes: { for: 124000, against: 8900 },
    quorum: 100,
    endDate: "Feb 10, 2026",
    category: "Feature",
    proposer: "Foundation"
  },
  {
    id: "IRP-039",
    title: "Protocol Fee Structure Revision v2.1",
    desc: "Updating the base protocol fee from 0.5% to 0.45% for commitments exceeding 1 BTC to incentivize larger protocol deposits.",
    status: "PASSED",
    votes: { for: 32000, against: 89000 },
    quorum: 100,
    endDate: "Jan 15, 2026",
    category: "Fee",
    proposer: "SP2...8W1"
  }
];

export default function GovernancePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const votingPower = 100; // Derived from reputation

  const filteredProposals = activeFilter === 'All' 
    ? PROPOSALS 
    : PROPOSALS.filter(p => p.status === activeFilter.toUpperCase());

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative pt-16 lg:pt-0">
        {/* Technical Header */}
        <header className="h-20 lg:h-24 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-background-dark/40 backdrop-blur-xl z-20 sticky top-0 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
             <div className="p-2 lg:p-3 bg-primary/10 rounded-2xl border border-primary/20 shrink-0">
                <Gavel className="text-primary" size={18} />
             </div>
             <div className="min-w-0">
                <h1 className="text-sm lg:text-2xl font-black text-white uppercase tracking-tighter truncate">On-Chain Governance</h1>
                <p className="hidden md:block text-[10px] text-muted-silver uppercase font-bold tracking-[0.2em] mt-0.5">Consensus Layer Activity_</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6 ml-2">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Voting Power</span>
               <span className="text-xs font-black text-white">{votingPower} <span className="text-primary tracking-tighter">REP-WT</span></span>
             </div>
             <div className="h-8 w-px bg-white/10 hidden sm:block" />
             <button className="px-4 lg:px-6 py-2.5 bg-primary text-background-dark text-[10px] lg:text-xs font-black rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
                New Prop
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 scroll-smooth bg-glow custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* Protocol Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
               {[
                 { label: "Processed", val: "42", icon: FileText, color: "text-blue-400" },
                 { label: "Quorum", val: "84.2%", icon: Users, color: "text-purple-400" },
                 { label: "Treasury", val: "1.4k BTC", icon: BarChart3, color: "text-primary" },
                 { label: "Consensus", val: "STABLE", icon: Activity, color: "text-green-400" },
               ].map((stat, i) => (
                 <motion.div 
                   key={stat.label}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-panel p-4 md:p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all bg-white/1"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-white/2 ${stat.color}`}>
                          <stat.icon size={16} />
                       </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg lg:text-2xl font-black text-white">{stat.val}</p>
                 </motion.div>
               ))}
            </section>

            {/* Main Proposals Section */}
            <section className="space-y-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="space-y-2">
                    <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3 italic">
                      Independent Proposals
                    </h2>
                    <p className="text-slate-500 text-xs italic">Verification required for reputation-weighted voting.</p>
                 </div>
                 
                 <div className="flex gap-1 bg-white/2 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                    {['All', 'Active', 'Passed', 'Rejected'].map(filter => (
                      <button 
                         key={filter}
                         onClick={() => setActiveFilter(filter)}
                         className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-primary text-background-dark shadow-md' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                         {filter}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProposals.map((proposal) => (
                      <motion.div 
                        key={proposal.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group relative glass-panel p-6 md:p-8 lg:p-10 rounded-4xl border-white/5 hover:border-primary/20 transition-all overflow-hidden bg-white/1"
                      >
                         {/* Header: ID and Status Tags */}
                         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                               <span className="text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">{proposal.id}</span>
                               <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-700" />
                               <span className="hidden sm:inline">Prop by {proposal.proposer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                 proposal.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                                 proposal.status === 'PASSED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' :
                                 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                               }`}>
                                 {proposal.status}
                               </span>
                               <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-white/5">
                                 {proposal.category}
                               </span>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            <div className="lg:col-span-7 space-y-6">
                               <h3 className="text-2xl lg:text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tighter uppercase leading-tight">{proposal.title}</h3>
                               <p className="text-sm text-slate-400 font-light leading-relaxed wrap-break-word">{proposal.desc}</p>
                               
                               <div className="pt-2 flex flex-wrap items-center gap-6">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                        <Clock size={14} />
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {proposal.timeLeft ? `Ends in ${proposal.timeLeft}` : `Ended ${proposal.endDate}`}
                                     </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                        <Users size={14} />
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Quorum {proposal.quorum}% Reach
                                     </span>
                                  </div>
                               </div>
                            </div>

                            <div className="lg:col-span-5 space-y-8 lg:pl-12 lg:border-l border-white/5">
                               <div className="space-y-4">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vote Distribution</span>
                                     <div className="flex items-baseline gap-2">
                                       <span className="text-2xl font-black text-white italic">{(proposal.votes.for / (proposal.votes.for + proposal.votes.against) * 100).toFixed(1)}%</span>
                                       <span className="text-[10px] text-primary font-black uppercase tracking-widest">FOR</span>
                                     </div>
                                  </div>
                                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against) * 100)}%` }}
                                      className="h-full bg-primary shadow-[0_0_15px_rgba(169,208,195,0.4)]"
                                     />
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(proposal.votes.against / (proposal.votes.for + proposal.votes.against) * 100)}%` }}
                                      className="h-full bg-red-500/30"
                                     />
                                  </div>
                                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                                     <div className="flex flex-col">
                                        <span className="text-white font-black">{proposal.votes.for.toLocaleString()}</span>
                                        <span>Voting Power</span>
                                     </div>
                                     <div className="flex flex-col items-end text-right">
                                        <span className="text-white font-black">{proposal.votes.against.toLocaleString()}</span>
                                        <span>Voting Power</span>
                                     </div>
                                  </div>
                               </div>

                               {proposal.status === 'ACTIVE' ? (
                                 <div className="grid grid-cols-2 gap-4">
                                   <button className="py-4 bg-primary text-background-dark text-[10px] font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest shadow-xl shadow-primary/10 active:scale-95">
                                      VOTE FOR
                                   </button>
                                   <button className="py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest active:scale-95">
                                      VOTE AGAINST
                                   </button>
                                 </div>
                               ) : (
                                 <div className="py-4 px-6 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Status</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${proposal.status === 'PASSED' ? 'text-primary' : 'text-red-500'}`}>
                                       {proposal.status === 'PASSED' ? 'EXECUTED' : 'TERMINATED'}
                                    </span>
                                 </div>
                               )}
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </section>

            {/* Technical Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-7 glass-panel p-8 rounded-4xl border-white/5 bg-primary/2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <ShieldCheck size={20} />
                     </div>
                     <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Governance Security Protocol</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-light">
                     Ironclad utilizes <span className="text-white font-bold">Reputation-Weighted Voting</span> powered by Clarity smart contracts. Your voting power is cryptographically derived from the length and volume of your active BTC commitments.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Snapshot</p>
                        <p className="text-[11px] font-mono text-white">Block #842,015</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Delay</p>
                        <p className="text-[11px] font-mono text-white">144 Blocks</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Execution</p>
                        <p className="text-[11px] font-mono text-white">Autonomous</p>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-5 glass-panel p-8 rounded-4xl border-amber-500/10 bg-amber-500/1 flex flex-col justify-center gap-4 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-3 text-amber-500">
                    <AlertTriangle size={24} className="group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-white uppercase tracking-tighter italic">Active Warning</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Governance tokens are currently <span className="text-amber-500 font-bold underline underline-offset-4 decoration-amber-500/30">locked for distribution</span>. Initial participation is restricted to holders with Protocol Reputation scores exceeding <span className="text-white font-bold">1,000</span>.
                  </p>
                  <button className="w-full py-4 bg-white/2 border border-white/5 text-slate-400 text-[10px] font-black rounded-2xl hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest active:scale-95">
                    Request Early Access
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
