"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Book, 
  Shield, 
  Code, 
  Terminal, 
  Search, 
  ChevronRight, 
  Network,
  Lock,
  Zap,
  ShieldAlert,
  FileText,
  Activity,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useState, useMemo } from "react";

interface Topic {
  name: string;
  desc: string;
  details?: string;
  code?: string;
  status?: string;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  topics: Topic[];
}

const SECTIONS: Section[] = [
  {
    id: "fundamentals",
    title: "Protocol Fundamentals",
    subtitle: "Bitcoin-Native Independent Logic",
    icon: Rocket,
    topics: [
      { 
        name: "Clarity Smart Contracts", 
        desc: "Ironclad uses Clarity, a decidable language where the code you see is the code that executes. No hidden state, no re-entrancy bugs.",
        details: "Decidability allows for precise gas estimation and eliminates entire classes of smart contract vulnerabilities found in Turing-complete languages."
      },
      { 
        name: "Proof-of-Transfer (PoX)", 
        desc: "Our protocol inherits Bitcoin's security by anchoring every L2 block to a Bitcoin L1 transaction through the Stacks consensus.",
        details: "PoX enables sBTC and trustless commitments by rewarding Bitcoin stakers for securing the network."
      },
      { 
        name: "Non-Custodial Design", 
        desc: "All keys are encrypted locally with AES-GCM. We never see your seed phrase or private keys.",
        details: "Security first architecture ensures you maintain 100% control over your assets at all times."
      }
    ]
  },
  {
    id: "api",
    title: "Smart Contract API",
    subtitle: "Programmable Value Settlement",
    icon: Code,
    topics: [
      { 
        name: "Vault Creation", 
        desc: "Programmatically initialize savings commitments with custom lock heights and penalty ratios.",
        code: `(contract-call? .ironclad-vault create-vault \n  (amount u10000000) \n  (lock-height u845000))`
      },
      { 
        name: "Reputation Oracle", 
        desc: "Query on-chain reputation data to determine fee discounts or protocol access levels.",
        code: `(get-reputation (tx-sender))`
      }
    ]
  },
  {
    id: "threat-modeling",
    title: "Threat Modeling",
    subtitle: "Active Mitigation Strategies",
    icon: ShieldAlert,
    topics: [
      {
        name: "Double Spend Mitigation",
        desc: "Transactions are only finalized after Bitcoin-level settlement confirmation via sBTC nodes.",
        status: "SECURE"
      },
      {
        name: "Contract Re-entrancy",
        desc: "Clarity language is non-Turing complete, eliminating entire classes of re-entrancy bugs.",
        status: "SECURE"
      }
    ]
  }
];

export default function DocsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("fundamentals");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const activeSection = useMemo(() => {
    return SECTIONS.find(s => s.id === activeTab) || SECTIONS[0];
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
       el.scrollIntoView({ behavior: 'smooth' });
       setActiveTab(id);
    }
  };

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      {session ? <Sidebar /> : <Navbar />}
      
      <main className={`flex-1 flex flex-col min-h-screen relative ${session ? 'h-screen overflow-hidden pt-16 lg:pt-0' : 'pt-32'}`}>
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl text-primary lg:hidden">
                <Book size={20} />
             </div>
             <h1 className="text-xl font-black text-white uppercase tracking-tighter">Protocol Docs</h1>
          </div>
          
          <div className="relative group flex-1 max-w-sm ml-4 lg:ml-8">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={14} />
             <input 
               type="text"
               placeholder="Search specs..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-silver/30"
             />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="hidden lg:block w-72 border-r border-white/5 p-8 overflow-y-auto bg-background-dark/20 backdrop-blur-sm">
            <nav className="space-y-10">
               {SECTIONS.map(s => (
                 <div key={s.id} className="space-y-4">
                    <button 
                      onClick={() => scrollToSection(s.id)}
                      className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === s.id ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                    >
                       <s.icon size={16} />
                       {s.title}
                    </button>
                    <ul className="space-y-2.5 ml-7">
                       {s.topics.map(t => (
                         <li key={t.name}>
                            <button 
                              onClick={() => {
                                scrollToSection(s.id);
                                setSelectedTopic(t);
                              }}
                              className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors text-left"
                            >
                                {t.name}
                            </button>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </nav>
          </aside>

          <section className="flex-1 overflow-y-auto p-6 md:p-12 space-y-20 custom-scrollbar scroll-smooth">
             {SECTIONS.map(s => (
               <div key={s.id} id={s.id} className="space-y-10 scroll-mt-32">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-primary border border-white/10">
                           <s.icon size={24} />
                        </div>
                        <div>
                           <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{s.title}</h2>
                           <p className="text-xs text-primary font-bold uppercase tracking-widest">{s.subtitle}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     {s.topics.map((topic, idx) => (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.1 }}
                         key={topic.name}
                         className="glass-panel p-8 rounded-4xl border-white/5 bg-white/2 hover:bg-white/4 transition-all cursor-pointer group relative overflow-hidden"
                         onClick={() => setSelectedTopic(topic)}
                       >
                          <div className="flex justify-between items-start mb-4">
                             <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{topic.name}</h3>
                             {topic.status && (
                               <span className="text-[9px] font-black px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">{topic.status}</span>
                             )}
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl wrap-break-word">{topic.desc}</p>
                          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Explore Specs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>
             ))}
          </section>
        </div>
      </main>

      <AnimatePresence>
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-md"
            onClick={() => setSelectedTopic(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="max-w-2xl w-full glass-panel p-10 rounded-[3rem] border-white/10 bg-background-dark relative"
               onClick={e => e.stopPropagation()}
             >
                <div className="space-y-6">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedTopic.name}</h3>
                   <div className="h-px bg-white/10 w-full" />
                   <p className="text-slate-400 leading-relaxed font-light wrap-break-word">{selectedTopic.desc}</p>
                   {selectedTopic.details && (
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs text-slate-300 leading-relaxed italic wrap-break-word">{selectedTopic.details}</p>
                     </div>
                   )}
                   {selectedTopic.code && (
                     <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-primary overflow-x-auto">
                        <pre>{selectedTopic.code}</pre>
                     </div>
                   )}
                   <button 
                     onClick={() => setSelectedTopic(null)}
                     className="w-full py-4 bg-primary text-background-dark font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all"
                   >
                     Clear Inspection View
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
