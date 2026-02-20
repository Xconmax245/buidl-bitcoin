"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useWallet } from "@/providers/WalletProvider";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Lock, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Globe,
  Database,
  RefreshCcw,
  Layers,
  BarChart3
} from "lucide-react";
import { stacksService } from "@/lib/stacks/service";

// Mock data for the visualization
const CHartData = [
  { day: "01", tvl: 1240, flow: 120 },
  { day: "05", tvl: 1280, flow: 140 },
  { day: "10", tvl: 1350, flow: 110 },
  { day: "15", tvl: 1320, flow: 160 },
  { day: "20", tvl: 1390, flow: 180 },
  { day: "25", tvl: 1450, flow: 150 },
  { day: "30", tvl: 1515, flow: 195 },
];

const RecentEvents = [
  { id: 1, type: "seal", user: "SP3...4X2", amount: "1.25 BTC", time: "2 mins ago", tier: "Strategic" },
  { id: 2, type: "reward", user: "SP1...9Q7", amount: "0.004 BTC", time: "14 mins ago", tier: "Standard" },
  { id: 3, type: "seal", user: "SP2...8W1", amount: "4.50 BTC", time: "28 mins ago", tier: "Halving Cycle" },
  { id: 4, type: "matured", user: "SP4...1V9", amount: "0.85 BTC", time: "1 hour ago", tier: "Short Term" },
];

export default function AnalyticsPage() {
  const { isLoading } = useWallet();
  const [activeRange, setActiveRange] = useState('30D');
  const [hoveredData, setHoveredData] = useState<any>(null);
  
  // Projection Calculator State
  const [calcBtc, setCalcBtc] = useState(1);
  const [calcYears, setCalcYears] = useState(5);
  const ironcladApy = 5.2;
  const bankApy = 0.05;

  const [realMetrics, setRealMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      const [pox, security] = await Promise.all([
        stacksService.getPoXInfo(),
        stacksService.getProtocolSecurityStatus()
      ]);
      setRealMetrics({ pox, security });
    };
    fetchRealData();
  }, []);

  const sovereignTotal = calcBtc * Math.pow(1 + ironcladApy/100, calcYears);
  const bankTotal = calcBtc * Math.pow(1 + bankApy/100, calcYears);

  // SVG Chart Generation logic
  const maxTVL = Math.max(...CHartData.map(d => d.tvl));
  const minTVL = Math.min(...CHartData.map(d => d.tvl));
  const points = CHartData.map((d, i) => {
    const x = (i / (CHartData.length - 1)) * 100;
    const y = 100 - ((d.tvl - minTVL) / (maxTVL - minTVL)) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:py-16">
          
          {/* Header section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                  Global Metrics
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Protocol Stream
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-tight font-bold text-white mb-4">Protocol Analytics</h1>
              <p className="text-slate-400 text-base md:text-lg max-w-xl">Deep transparency into Bitcoin commitments, velocity, and network security parameters.</p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {['24H', '7D', '30D', 'ALL'].map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeRange === r ? 'bg-white text-background-dark shadow-md' : 'text-slate-500 hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </header>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                label: "Total Value Locked", 
                val: realMetrics?.pox ? (realMetrics.pox.current_cycle.stacked_ustx / 100000000).toFixed(2) : "1,402.85", 
                unit: "sBTC", 
                icon: Lock, 
                status: "up", 
                trend: "+12.4%" 
              },
              { label: "Active Commitments", val: "1,240", unit: "Vaults", icon: Users, status: "up", trend: "+8.2%" },
              { label: "Ecosystem Velocity", val: "24.8", unit: "Bitflow/ALEX", icon: Layers, status: "up", trend: "OPTIMAL" },
              { 
                label: "Nodes Enforcing", 
                val: realMetrics?.security?.blockFinality || "100%", 
                unit: "Uptime", 
                icon: ShieldCheck, 
                status: "stable", 
                trend: realMetrics?.security?.finalityLag || "NOMINAL" 
              },
            ].map((m, i) => (
              <motion.div 
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-3xl border-white/5 group hover:border-primary/20 transition-all cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 text-primary group-hover:scale-110 transition-transform">
                    <m.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${m.status === 'up' ? 'text-green-400' : 'text-primary'}`}>
                    {m.status === 'up' ? <ArrowUpRight size={12} /> : null}
                    {m.trend}
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-tight font-bold text-white tracking-tight">{m.val}</span>
                  <span className="text-xs text-slate-500 font-mono">{m.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Main Chart Card */}
            <div className="lg:col-span-8">
              <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 h-full relative overflow-hidden group">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Commitment Velocity</h3>
                    <p className="text-sm text-slate-500">Net institutional inflow vs on-chain maturity</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
                    <TrendingUp size={20} />
                  </div>
                </div>

                {/* SVG Chart Area */}
                <div className="h-64 relative">
                   <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none" 
                    className="w-full h-full overflow-visible"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const index = Math.min(CHartData.length - 1, Math.max(0, Math.floor((x / 100) * CHartData.length)));
                      setHoveredData(CHartData[index]);
                    }}
                    onMouseLeave={() => setHoveredData(null)}
                   >
                     <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a9d0c3" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#a9d0c3" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     
                     {/* Background Grid */}
                     {[0, 25, 50, 75, 100].map(v => (
                       <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
                     ))}

                     {/* Area */}
                     <motion.polyline
                       initial={{ opacity: 0, pathLength: 0 }}
                       animate={{ opacity: 1, pathLength: 1 }}
                       points={areaPoints}
                       fill="url(#chartGradient)"
                     />

                     {/* Path Line - Muted */}
                     <motion.polyline
                       initial={{ opacity: 0, pathLength: 0 }}
                       animate={{ opacity: 1, pathLength: 1 }}
                       points={points}
                       fill="none"
                       stroke="#a9d0c3"
                       strokeWidth="1.5"
                       strokeLinecap="round"
                     />

                     {/* Data points */}
                     {CHartData.map((d, i) => {
                        const x = (i / (CHartData.length - 1)) * 100;
                        const y = 100 - ((d.tvl - minTVL) / (maxTVL - minTVL)) * 80 - 10;
                        return (
                          <circle 
                            key={i} 
                            cx={x} cy={y} r="0.8" 
                            className={`fill-primary transition-all ${hoveredData?.day === d.day ? 'r-[1.5] brightness-125' : ''}`} 
                          />
                        );
                     })}
                   </svg>

                   {/* Tooltip Overlay */}
                   <AnimatePresence>
                    {hoveredData && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 bg-background-dark/95 border border-white/10 p-4 rounded-2xl shadow-xl z-20 pointer-events-none"
                      >
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Day {hoveredData.day}</p>
                         <div className="flex items-baseline gap-2">
                           <span className="text-xl font-bold text-white">{hoveredData.tvl}</span>
                           <span className="text-xs text-primary font-bold">sBTC</span>
                         </div>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/5">
                   <div className="flex gap-10">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Growth Index</p>
                        <p className="text-lg font-bold text-green-400">+18.2%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Daily Vol</p>
                        <p className="text-lg font-bold text-white">42.5 sBTC</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-xl text-xs font-bold border border-primary/10">
                      <Globe size={14} className="animate-spin-slow" />
                      GLOBAL CONSENSUS 
                   </div>
                </div>
              </div>
            </div>

            {/* Side Distribution Card */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 h-full space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Protocol Distribution</h3>
                  <p className="text-sm text-slate-400">Total User Allocation by Maturity Tier</p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Short Term", val: 15, color: "bg-blue-400" },
                    { label: "Mid Term", val: 28, color: "bg-indigo-500" },
                    { label: "Strategic", val: 42, color: "bg-primary" },
                    { label: "Halving Cycle", val: 15, color: "bg-amber-500" },
                  ].map((tier) => (
                    <div key={tier.label} className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-bold text-slate-300 uppercase tracking-widest">{tier.label}</span>
                        <span className="text-white font-mono font-bold">{tier.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${tier.val}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${tier.color} rounded-full opacity-80`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                   <div className="bg-white/2 rounded-3xl p-6 border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <BarChart3 size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-white">Yield Efficiency</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Currently tracking at <span className="text-primary font-bold">104.2% efficiency</span> relative to baseline Bitcoin yield models.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yield Projection Calculator Section */}
          <section className="mb-20">
            <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                              <Zap size={20} />
                           </div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Strategy Engine</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                           Project Your <span className="text-primary">Sovereign Growth</span>.
                        </h2>
                        <p className="text-slate-400 mt-6 leading-relaxed max-w-md">
                           Calculate the delta between institutional Bitcoin commitments and legacy financial preservation models.
                        </p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                              <span>Initial Allocation</span>
                              <span className="text-white">{calcBtc} BTC</span>
                           </div>
                           <input 
                              type="range" min="0.1" max="100" step="0.1"
                              value={calcBtc} onChange={(e) => setCalcBtc(Number(e.target.value))}
                              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                           />
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                              <span>Commitment Window</span>
                              <span className="text-white">{calcYears} Years</span>
                           </div>
                           <input 
                              type="range" min="1" max="20" step="1"
                              value={calcYears} onChange={(e) => setCalcYears(Number(e.target.value))}
                              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-4">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Sovereign Standing</p>
                        <h4 className="text-2xl font-black text-white tracking-tight">{sovereignTotal.toFixed(4)} <span className="text-xs font-bold">BTC</span></h4>
                        <div className="pt-4 border-t border-primary/10">
                           <p className="text-[9px] text-slate-500 uppercase font-black">Growth Yield</p>
                           <p className="text-sm font-bold text-green-400">+{((sovereignTotal - calcBtc) / calcBtc * 100).toFixed(1)}%</p>
                        </div>
                     </div>
                     <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-4 opacity-60">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Legacy Bank</p>
                        <h4 className="text-2xl font-black text-white/40 tracking-tight">{bankTotal.toFixed(4)} <span className="text-xs font-bold">BTC</span></h4>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[9px] text-slate-400 uppercase font-black">Growth Yield</p>
                           <p className="text-sm font-bold text-slate-500">+{((bankTotal - calcBtc) / calcBtc * 100).toFixed(2)}%</p>
                        </div>
                     </div>
                     <div className="md:col-span-2 p-6 rounded-4xl bg-white/2 border border-white/5 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400 italic">Total Protocol Advantage:</p>
                        <p className="text-lg font-black text-white">{(sovereignTotal - bankTotal).toFixed(4)} <span className="text-xs text-primary">BTC DELTA</span></p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Real-time Ledger */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Activity size={24} className="text-primary" />
                Live Network Ledger
              </h2>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                <RefreshCcw size={14} className="animate-reverse-spin" />
                Force Refresh
              </button>
            </div>

            <div className="glass-panel rounded-[2.5rem] border-white/5 overflow-x-auto">
              <table className="w-full text-left min-w-[800px] lg:min-w-full">
                <thead className="bg-white/2 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Transaction Type</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sovereign Identity</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Seal Amount</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Protocol Tier</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RecentEvents.map((event, i) => (
                    <motion.tr 
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group hover:bg-white/2 transition-all cursor-default"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            event.type === 'seal' ? 'bg-primary/10 text-primary' : 
                            event.type === 'reward' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-blue-400/10 text-blue-400'
                          }`}>
                            {event.type === 'seal' ? <Lock size={14} /> : 
                             event.type === 'reward' ? <Zap size={14} /> :
                             <RefreshCcw size={14} />}
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{event.type} Commitment</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-slate-400 font-mono">{event.user}</td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-white">{event.amount}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 font-bold text-slate-300 uppercase">
                          {event.tier}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right text-[10px] font-bold text-slate-500 uppercase">{event.time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                 <Database size={16} className="text-primary" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blocks Scanned: 842,015</span>
               </div>
               <div className="flex items-center gap-2">
                 <RefreshCcw size={16} className="text-primary" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Sync: 0s ago</span>
               </div>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Ironclad Sovereign Protocol v1.4.2-stable</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
