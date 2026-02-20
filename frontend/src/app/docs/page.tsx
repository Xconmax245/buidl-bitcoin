"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Code, 
  Shield, 
  Zap, 
  Cpu, 
  Network, 
  Terminal,
  FileText,
  ChevronRight,
  Hash,
  Database,
  Globe
} from "lucide-react";

const DOC_SECTIONS = [
  {
    id: "SEC-01",
    title: "Protocol Fundamentals",
    desc: "Understanding the trustless handshake between Bitcoin's settlement and Stacks' smart contract logic.",
    icon: Network,
    links: ["Sovereign Proof of Reserve", "Deterministic Derivation", "Epoch Calculations"]
  },
  {
    id: "SEC-02",
    title: "Smart Contract API",
    desc: "Complete reference for the savings.clar contract functions and error constants.",
    icon: Code,
    links: ["init-vault()", "verify-commitment()", "release-maturity()", "Penalty Slashing Logic"]
  },
  {
    id: "SEC-03",
    title: "Governance Model",
    desc: "How reputation-weighted voting influences protocol parameters and fee structures.",
    icon: Globe,
    links: ["REP-Token Specs", "Quorum Requirements", "Proposal Lifecycle"]
  },
  {
    id: "SEC-04",
    title: "Security & Audits",
    desc: "Detailed breakdown of formal verification steps and third-party audit reports.",
    icon: Shield,
    links: ["Trail of Bits Report", "Clarity Static Analysis", "Network Multi-sig Specs"]
  }
];

export default function DocsPage() {
  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Technical Wiki</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <BookOpen size={14} className="text-primary" />
              Protocol v1.4 Specs
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs font-bold text-slate-400">
               <span className="w-2 h-2 rounded-full bg-primary" />
               V1.4.2-STABLE
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-16 pb-20">
            
            {/* HER0 - Documentation Search */}
            <section className="text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
              >
                <Terminal size={12} />
                Knowledge Base_
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                Developer <span className="text-primary">Resources</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                Comprehensive guides for building assets and managing sovereign Bitcoin savings on the Ironclad Protocol.
              </p>
              
              <div className="max-w-2xl mx-auto relative group">
                 <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <input 
                  type="text" 
                  placeholder="Search protocol specs, contract functions, or FAQs..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none focus:border-primary transition-all relative z-10"
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-slate-500">
                    <Hash size={20} />
                 </div>
              </div>
            </section>

            {/* Documentation Categories */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {DOC_SECTIONS.map((section, i) => (
                 <motion.div 
                   key={section.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-panel p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group"
                 >
                    <div className="flex items-start justify-between mb-8">
                       <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-[0_0_20px_rgba(169,208,195,0.1)]">
                          <section.icon size={28} />
                       </div>
                       <span className="text-[10px] font-mono text-slate-600 font-bold">{section.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{section.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-8">{section.desc}</p>
                    
                    <div className="space-y-3">
                       {section.links.map(link => (
                         <button key={link} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left group/link">
                            <span className="text-xs text-slate-400 group-hover/link:text-white transition-colors">{link}</span>
                            <ChevronRight size={14} className="text-slate-700 group-hover/link:text-primary transition-colors" />
                         </button>
                       ))}
                    </div>
                 </motion.div>
               ))}
            </section>

            {/* Featured Code Snippet */}
            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <Database size={24} className="text-primary" />
                  <h3 className="text-2xl font-bold text-white">Smart Contract Preview</h3>
               </div>
               <div className="glass-panel rounded-[2.5rem] border-white/5 overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 bg-white/2 border-b border-white/5">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                     </div>
                     <span className="text-[10px] font-mono text-slate-500 ml-4">savings.clar</span>
                  </div>
                  <div className="p-8 bg-background-dark/50">
                     <pre className="text-xs md:text-sm font-mono leading-relaxed text-slate-400 overflow-x-auto">
                        <code className="block">
                          {`;; On-chain commitment logic
(define-public (initialize-savings-vault (amount uint) (lock-period uint))
  (let ((caller tx-sender))
    (asserts! (>= amount MIN_COMMITMENT) ERR_INSUFFICIENT_FUNDS)
    (asserts! (<= lock-period MAX_DURATION) ERR_OUT_OF_BOUNDS)
    
    ;; Update protocol state via map
    (map-set user-commitments caller {
      principal: amount,
      maturity: (+ block-height lock-period),
      status: 'LOCKED
    })
    
    (ok true)))`}
                        </code>
                     </pre>
                  </div>
               </div>
            </section>

            {/* Documentation Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
               {[
                 { title: "Whitepaper", sub: "Core Economic Theory", icon: FileText },
                 { title: "API Docs", sub: "SDK & Integration", icon: Terminal },
                 { title: "Audits", sub: "3rd Party Verification", icon: Shield },
               ].map((item, i) => (
                 <button key={i} className="flex items-center gap-4 p-6 glass-panel rounded-3xl border-white/5 hover:border-primary/20 transition-all text-left">
                    <div className="p-3 bg-white/2 rounded-2xl text-slate-400 group-hover:text-primary transition-colors">
                       <item.icon size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">{item.title}</p>
                       <p className="text-[10px] text-slate-500 uppercase">{item.sub}</p>
                    </div>
                 </button>
               ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
