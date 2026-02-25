"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { 
  ShieldCheck, 
  Trophy, 
  Zap, 
  Lock, 
  History, 
  ChevronRight, 
  Dna, 
  Cpu, 
  Globe, 
  AlertCircle,
  BarChart3,
  Award,
  Fingerprint,
  Gavel,
  ShieldAlert,
  Users,
  RefreshCw
} from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useNotifications } from "@/providers/NotificationProvider";
import { useContract } from "@/hooks/useContract";
import { toast } from "sonner";

// Technical Achievement Data Templates
const ACHIEVEMENTS_TEMPLATE = [
  {
    id: "AC-001",
    title: "Genesis Seal",
    desc: "Successfully locked your first BTC commitment on the Stacks layer.",
    status: "LOCKED",
    timestamp: "Pending",
    hash: "0x...",
    icon: Lock,
    points: 100,
    category: "Security",
    isSoulbound: true
  },
  {
    id: "AC-002",
    title: "Halving Survivor",
    desc: "Maintained a locked position through a full Bitcoin Halving event.",
    status: "LOCKED",
    progress: 0,
    requirement: "Block #840,000",
    icon: Dna,
    points: 800,
    category: "Consistency",
    isSoulbound: true
  },
  {
    id: "AC-003",
    title: "Epoch Survivor",
    desc: "Maintained a locked position through a full Bitcoin difficulty adjustment window.",
    status: "LOCKED",
    progress: 0,
    requirement: "2016 Blocks",
    icon: History,
    points: 250,
    category: "Consistency",
    isSoulbound: true
  },
  {
    id: "AC-004",
    title: "Protocol Node",
    desc: "Contributed to 5 on-chain governance proposals with reputation-weighted voting.",
    status: "LOCKED",
    progress: 0,
    requirement: "1/5 Votes",
    icon: Globe,
    points: 500,
    category: "Governance",
    isSoulbound: true
  },
  {
    id: "AC-005",
    title: "Diamond Velocity",
    desc: "Committing more than 1.0 BTC for a period exceeding 12 months.",
    status: "LOCKED",
    progress: 0,
    requirement: "12 Months",
    icon: Award,
    points: 1000,
    category: "Institutional",
    isSoulbound: true
  },
  {
    id: "AC-006",
    title: "Non-Custodial Purist",
    desc: "Connected hardware signer and performed a multi-sig vault initialization.",
    status: "LOCKED",
    timestamp: "Pending",
    hash: "0x...",
    icon: Fingerprint,
    points: 150,
    category: "Privacy",
    isSoulbound: true
  },
];

const PERKS = [
  { 
    title: "Collateral Efficiency", 
    desc: "Reduced LTV requirement from 150% to 110% for protocol lending.", 
    req: 500,
    icon: ShieldCheck 
  },
  { 
    title: "Priority Peg-Out", 
    desc: "Faster sBTC withdrawal processing during network congestion.", 
    req: 1200,
    icon: Zap 
  },
  { 
    title: "Governance Weight", 
    desc: "2.5x voting power multiplier in protocol parameter proposals.", 
    req: 1200,
    icon: Gavel 
  },
  { 
    title: "The Inner Circle", 
    desc: "Access to private governance chambers and early protocol beta releases.", 
    req: 2500,
    icon: Globe 
  }
];

export default function ReputationPage() {
  const { isFullyOnboarded, isLoading: onboardingLoading } = useOnboarding();
  const { addNotification } = useNotifications();
  const { castVote } = useContract();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [repData, setRepData] = useState({
    reputation: 0,
    rank: "IRON_LEVEL_SENTINEL",
    achievements: [] as any[]
  });

  useEffect(() => {
    setMounted(true);
    fetchReputation();
  }, []);

  const fetchReputation = async () => {
    try {
      const res = await fetch("/api/reputation");
      if (res.ok) {
        const data = await res.json();
        
        // Map templates back to database achievements to get icons
        const mergedAchievements = (data.achievements && data.achievements.length > 0 ? data.achievements : ACHIEVEMENTS_TEMPLATE).map((a: any) => {
          const template = ACHIEVEMENTS_TEMPLATE.find(t => t.id === a.id);
          return { ...a, icon: template?.icon || AlertCircle };
        });

        setRepData({
          reputation: data.reputation || 0,
          rank: data.rank || "IRON_LEVEL_SENTINEL",
          achievements: mergedAchievements
        });
      }
    } catch (err) {
      console.error("Failed to fetch reputation", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Simulate on-chain verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let newRep = repData.reputation + 50;
      let newAchievements = [...repData.achievements];
      
      // Auto-unlock first achievement logic for demo if it's the first sync
      if (newAchievements[0].status === "LOCKED") {
        newAchievements[0] = { 
          ...newAchievements[0], 
          status: "UNLOCKED", 
          timestamp: new Date().toLocaleDateString(),
          hash: "sx" + Math.random().toString(16).slice(2, 8) + "...f92"
        };
        newRep += 100;
      }

      // Convert back to JSON for DB storage (remove non-serializable icon)
      const dbAchievements = newAchievements.map(({ icon, ...rest }) => rest);

      const res = await fetch("/api/reputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reputation: newRep, 
          achievements: dbAchievements,
          rank: newRep > 500 ? "IRON_KNIGHT" : "IRON_LEVEL_SENTINEL"
        })
      });

      if (res.ok) {
        const updated = await res.json();
        // Re-merge icons after update
        const mergedUpdated = updated.achievements.map((a: any) => {
          const template = ACHIEVEMENTS_TEMPLATE.find(t => t.id === a.id);
          return { ...a, icon: template?.icon || AlertCircle };
        });

        setRepData({
          reputation: updated.reputation,
          rank: updated.rank,
          achievements: mergedUpdated
        });
        toast.success("Identity Matrix Synchronized");
      }
    } catch (err) {
      toast.error("Handshake Failed");
    } finally {
      setSyncing(false);
    }
  };

  const nextRankScore = 500;
  const progressToNext = Math.min((repData.reputation / nextRankScore) * 100, 100);

  const filteredAchievements = useMemo(() => {
    if (activeCategory === "All") return repData.achievements;
    return repData.achievements.filter(a => a.category === activeCategory);
  }, [activeCategory, repData.achievements]);

  const categories = ["All", "Security", "Consistency", "Governance", "Institutional", "Privacy", "Strategy"];

  const handleVote = async (id: string, support: boolean) => {
    await castVote(id, support);
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
           <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] animate-pulse">Calculating Reputation Matrix</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Protocol Reputation</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Dna size={14} className="text-primary" />
              Proof of Loyalty
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Current Tier:</span>
               <span className="text-xs font-bold text-primary">{repData.rank.replace(/_/g, ' ')}</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* HER0 - Identity & Progress */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative group">
                   {/* Radial Progress */}
                   <svg className="w-56 h-56 transform -rotate-90">
                      <circle 
                        cx="112" cy="112" r="100" 
                        stroke="currentColor" strokeWidth="4" 
                        fill="transparent" className="text-white/5" 
                      />
                      <motion.circle 
                        cx="112" cy="112" r="100" 
                        stroke="currentColor" strokeWidth="8" 
                        strokeDasharray={628}
                        initial={{ strokeDashoffset: 628 }}
                        animate={{ strokeDashoffset: 628 - (628 * progressToNext) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        fill="transparent" className="text-primary drop-shadow-[0_0_12px_rgba(169,208,195,0.4)]" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-6xl font-black text-white tracking-tighter">{repData.reputation}</span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">REP_CREDIT</span>
                   </div>
                </div>
                <div className="mt-6 text-center">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Rank Progress</p>
                   <p className="text-sm text-white font-medium">{repData.reputation}/{nextRankScore} to <span className="text-primary">{repData.reputation >= 500 ? 'Immortal Oracle' : 'Iron Knight'}</span></p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-8">
                 <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                          <Cpu size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Reputation Calculus</h2>
                      </div>
                      <button 
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase hover:bg-primary hover:text-background-dark transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Syncing...' : 'Sync Protocol'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       {[
                         { label: "Duration Weight", val: "x1.5", desc: "Lock longevity bonus" },
                         { label: "Volume Factor", val: "0.2%", desc: "Weighted by BTC amount" },
                         { label: "Consensus Participation", val: "Active", desc: "Governance engagement" },
                         { label: "Slashing Risk", val: "Nominal", desc: "Clean commitment history" },
                       ].map(stat => (
                         <div key={stat.label}>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-white mb-1">{stat.val}</p>
                            <p className="text-[9px] text-slate-500">{stat.desc}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-4">
                    {PERKS.map((perk, i) => (
                      <div key={i} className={`flex-1 min-w-[200px] p-5 rounded-3xl border transition-all ${repData.reputation >= perk.req ? 'bg-primary/5 border-primary/20 opacity-100' : 'bg-white/2 border-white/5 opacity-40'}`}>
                         <div className="flex items-center justify-between mb-4">
                            <perk.icon size={18} className={repData.reputation >= perk.req ? 'text-primary' : 'text-slate-600'} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{repData.reputation >= perk.req ? 'Active' : `Requires ${perk.req}`}</span>
                         </div>
                         <p className="text-sm font-bold text-white mb-1">{perk.title}</p>
                         <p className="text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Achievement Grid Section */}
            <section className="space-y-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                      <Trophy size={28} className="text-primary" />
                      Achievement Ledger
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">On-chain milestones verified by Ironclad Settlement layer.</p>
                 </div>
                 
                 <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((achievement, i) => (
                      <motion.div 
                        key={achievement.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`group relative glass-panel p-6 rounded-4xl border-white/5 flex flex-col h-full transition-all duration-500 ${achievement.status === 'UNLOCKED' ? 'hover:border-primary/40 cursor-pointer shadow-lg shadow-primary/5' : 'opacity-60 grayscale-[0.5]'}`}
                      >
                         <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${achievement.status === 'UNLOCKED' ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(169,208,195,0.15)]' : 'bg-white/5 text-slate-600'}`}>
                               <achievement.icon size={24} />
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">{achievement.id}</p>
                               <p className={`text-[10px] font-bold uppercase transition-colors ${achievement.status === 'UNLOCKED' ? 'text-primary' : 'text-slate-600'}`}>
                                 {achievement.status}
                               </p>
                            </div>
                         </div>

                         {achievement.isSoulbound && (
                           <div className="flex items-center gap-1.5 mb-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                              <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">Soulbound Protocol Badge</span>
                           </div>
                         )}

                         <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{achievement.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">{achievement.desc}</p>
                         </div>

                         <div className="pt-6 border-t border-white/5 mt-auto">
                            {achievement.status === 'UNLOCKED' ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                  <span className="text-slate-500">Verified On</span>
                                  <span className="text-white">{achievement.timestamp}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-slate-600">HASH</span>
                                  <span className="text-primary/70 truncate ml-4">{achievement.hash}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                  <span className="text-slate-500">Progress</span>
                                  <span className="text-slate-400">{achievement.progress || 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                   <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${achievement.progress || 0}%` }}
                                    className="h-full bg-primary/40 rounded-full"
                                   />
                                </div>
                                <p className="text-[9px] text-amber-500/70 font-bold uppercase text-center tracking-tighter">Requires {achievement.requirement}</p>
                              </div>
                            )}
                         </div>

                         {/* Recognition Float */}
                         <div className="absolute -top-2 -right-2 bg-background-dark border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            +{achievement.points} XP
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </section>

            {/* Leaderboard Section */}
            <section className="space-y-8">
               <div className="flex items-end justify-between">
                  <div>
                     <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Users size={28} className="text-primary" />
                        Leaderboard of Honor
                     </h2>
                     <p className="text-slate-500 mt-2 text-sm italic">Privacy-preserving ranking by Time-Weighted Commitment.</p>
                  </div>
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Your Standing</p>
                     <p className="text-sm font-black text-primary">TOP {repData.reputation > 0 ? "8.2%" : "99.9%"}</p>
                  </div>
               </div>

               <div className="glass-panel rounded-[2.5rem] border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Identity</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reputation</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Commitment Score</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[
                          { rank: "01", user: "Protocol_Knight", tier: "Halving Cycle", rep: 12450, score: "128,400" },
                          { rank: "02", user: "Genesis_Builder", tier: "Gold Sentinel", rep: 9820, score: "94,200" },
                          { rank: "03", user: "Vault_Alpha", tier: "Strategic", rep: 8740, score: "82,100" },
                          { rank: "04", user: "Ironclad_Vault", tier: "Halving Cycle", rep: 7120, score: "68,450" },
                          { rank: "05", user: "Stacks_Guardian", tier: "Gold Sentinel", rep: 5430, score: "52,100" },
                        ].map((row, i) => (
                           <tr key={i} className="group hover:bg-white/2 transition-all">
                              <td className="px-8 py-5">
                                 <span className={`text-xs font-mono font-bold ${i === 0 ? 'text-primary' : 'text-slate-500'}`}>#{row.rank}</span>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                       <Fingerprint size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-white">{row.user}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase border border-white/10 px-2 py-1 rounded-md">{row.tier}</span>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="text-xs font-mono font-bold text-white">{row.rep}</span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <span className="text-xs font-mono font-bold text-primary">{row.score}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>

            {/* Governance Section */}
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                     <Gavel size={24} className="text-primary" />
                     Independent Governance
                  </h2>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Your Voting Power:</span>
                     <span className="text-sm font-black text-primary">{repData.reputation * 10} vSTX</span>
                  </div>
               </div>

               <div className="glass-panel rounded-4xl border-white/5 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                     {[
                        { title: "IP-084: Target APY Revision", status: "VOTING_ACTIVE", support: "82.4%", ends: "18h 42m", id: "084" },
                        { title: "IP-085: Bitflow Fee Optimization", status: "PENDING", support: "--", ends: "Starts in 2d", id: "085" }
                     ].map(prop => (
                        <div key={prop.id} className="bg-background-dark p-8 group hover:bg-white/2 transition-colors">
                           <div className="flex justify-between items-start mb-6">
                              <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${prop.status === 'VOTING_ACTIVE' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                 {prop.status}
                              </span>
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{prop.ends}</p>
                           </div>
                           <h4 className="text-lg font-bold text-white mb-4 group-hover:text-primary transition-colors">{prop.title}</h4>
                           <div className="flex items-end justify-between">
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Support</p>
                                 <p className="text-xl font-black text-white">{prop.support}</p>
                              </div>
                              <button 
                                onClick={() => handleVote(prop.id, true)}
                                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase hover:bg-primary hover:text-background-dark transition-all disabled:opacity-50"
                                disabled={prop.status !== 'VOTING_ACTIVE'}
                              >
                                 Cast Vote
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Reputation Velocity</h4>
                      <p className="text-xs text-slate-500">Net monthly score delta based on behavior</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-24 pt-4 px-2">
                    {[30, 45, 25, 60, 80, 50, 90, 100, 70, 85, 95, 110].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 1 }}
                        className={`flex-1 rounded-t-sm ${i === 11 ? 'bg-primary' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 italic">Projected 30-day gain: <span className="text-primary font-bold">+{repData.reputation > 0 ? '140' : '50'} REP</span> if current saving plans are finalized.</p>
               </div>

               <div className="glass-panel p-8 rounded-[2.5rem] border-amber-500/10 bg-amber-500/2 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reputation Slashing Risk</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                      Breaking a commitment triggers an immediate <span className="text-red-400 font-bold">Protocol Slashing Event</span>. Your protocol score will reset to baseline, and all unlocked perks will be revoked.
                    </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
