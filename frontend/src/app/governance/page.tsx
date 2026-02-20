"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileText, 
  Vote, 
  Users, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  BarChart3,
  Gavel,
  History,
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
    category: "Parameter",
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
    status: "PASSED",
    votes: { for: 124000, against: 8900 },
    quorum: 100,
    endDate: "Feb 10, 2024",
    category: "Feature",
    proposer: "Foundation"
  },
  {
    id: "IRP-039",
    title: "Protocol Fee Structure Revision v2.1",
    desc: "Updating the base protocol fee from 0.5% to 0.45% for commitments exceeding 1 BTC to incentivize larger sovereign deposits.",
    status: "REJECTED",
    votes: { for: 32000, against: 89000 },
    quorum: 100,
    endDate: "Jan 15, 2024",
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
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Technical Header */}
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">On-Chain Governance</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Vote size={14} className="text-primary" />
              Consensus Layer
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Your Voting Power</span>
               <span className="text-sm font-black text-white">{votingPower} <span className="text-primary">REP-WEIGHT</span></span>
             </div>
             <div className="h-10 w-px bg-white/5" />
             <button className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-background-dark transition-all">
                CREATE PROPOSAL
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* Protocol Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: "Proposals Processed", val: "42", icon: FileText, color: "text-blue-400" },
                 { label: "Active Quorum", val: "84.2%", icon: Users, color: "text-purple-400" },
                 { label: "Treasury Weight", val: "1.4k BTC", icon: BarChart3, color: "text-primary" },
                 { label: "Consensus Status", val: "STABLE", icon: Activity, color: "text-green-400" },
               ].map((stat, i) => (
                 <motion.div 
                   key={stat.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-panel p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 rounded-2xl bg-white/2 ${stat.color}`}>
                          <stat.icon size={18} />
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.val}</p>
                 </motion.div>
               ))}
            </section>

            {/* Main Proposals Section */}
            <section className="space-y-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                      <Gavel size={28} className="text-primary" />
                      Sovereign Proposals
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm italic">Verification required for reputation-weighted voting.</p>
                 </div>
                 
                 <div className="flex gap-2 bg-white/2 p-1 rounded-xl border border-white/5">
                    {['All', 'Active', 'Passed', 'Rejected'].map(filter => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-primary text-background-dark shadow-md' : 'text-slate-500 hover:text-white'}`}
                      >
                        {filter}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProposals.map((proposal, i) => (
                      <motion.div 
                        key={proposal.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="group relative glass-panel p-8 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-8 flex gap-3">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             proposal.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                             proposal.status === 'PASSED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                             'bg-red-500/10 text-red-500 border-red-500/20'
                           }`}>
                             {proposal.status}
                           </span>
                           <span className="px-3 py-1 rounded-full bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-white/5">
                             {proposal.category}
                           </span>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-8 space-y-4">
                               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                                  <span className="text-primary">{proposal.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                                  <span>Prop by {proposal.proposer}</span>
                               </div>
                               <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{proposal.title}</h3>
                               <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">{proposal.desc}</p>
                               
                               <div className="pt-4 flex items-center gap-8">
                                  <div className="flex items-center gap-2">
                                     <Clock size={14} className="text-slate-500" />
                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                        {proposal.timeLeft ? `Ends in ${proposal.timeLeft}` : `Ended ${proposal.endDate}`}
                                     </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Users size={14} className="text-slate-500" />
                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                        Quorum {proposal.quorum}% Reach
                                     </span>
                                  </div>
                               </div>
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                               <div className="space-y-3">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[10px] font-bold text-slate-500 uppercase">Vote Distribution</span>
                                     <div className="flex items-baseline gap-2">
                                       <span className="text-lg font-black text-white">{(proposal.votes.for / (proposal.votes.for + proposal.votes.against) * 100).toFixed(1)}%</span>
                                       <span className="text-[10px] text-primary font-bold">FOR</span>
                                     </div>
                                  </div>
                                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against) * 100)}%` }}
                                      className="h-full bg-primary"
                                     />
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(proposal.votes.against / (proposal.votes.for + proposal.votes.against) * 100)}%` }}
                                      className="h-full bg-red-500/50"
                                     />
                                  </div>
                                  <div className="flex justify-between text-[9px] font-mono text-slate-600">
                                     <span>{proposal.votes.for.toLocaleString()} Voting Power</span>
                                     <span>{proposal.votes.against.toLocaleString()} Voting Power</span>
                                  </div>
                               </div>

                               {proposal.status === 'ACTIVE' && (
                                 <div className="grid grid-cols-2 gap-3">
                                   <button className="py-3 bg-white/2 border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-primary hover:text-background-dark transition-all">
                                      VOTE FOR
                                   </button>
                                   <button className="py-3 bg-white/2 border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-red-500 hover:border-red-500 transition-all">
                                      VOTE AGAINST
                                   </button>
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
               <div className="lg:col-span-7 glass-panel p-8 rounded-[2.5rem] border-white/5 bg-primary/2">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <ShieldCheck size={20} />
                     </div>
                     <h4 className="text-lg font-black text-white uppercase tracking-tighter">Governance Security Protocol</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                     Ironclad utilizes <span className="text-white font-bold">Reputation-Weighted Voting</span> powered by Clarity smart contracts. Your voting power is cryptographically derived from the length and volume of your active BTC commitments.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-4 rounded-2xl bg-white/2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Snapshot</p>
                        <p className="text-xs font-mono text-white">Block #842,015</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Delay</p>
                        <p className="text-xs font-mono text-white">144 Blocks</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Execution</p>
                        <p className="text-xs font-mono text-white">Autonomous</p>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-5 glass-panel p-8 rounded-[2.5rem] border-amber-500/10 bg-amber-500/1 flex flex-col justify-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-3 text-amber-500">
                    <AlertTriangle size={24} />
                    <h4 className="font-bold text-white uppercase tracking-tight">Active Warning</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Governance tokens are currently <span className="text-amber-500 font-bold underline underline-offset-4 decoration-amber-500/30">locked for distribution</span>. Initial participation is restricted to holders with Sovereign Reputation scores exceeding <span className="text-white font-bold">1,000</span>.
                  </p>
                  <button className="w-full py-3 bg-white/5 border border-white/5 text-slate-400 text-[10px] font-bold rounded-xl hover:text-white transition-colors uppercase tracking-widest">
                    Request Early Access
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
