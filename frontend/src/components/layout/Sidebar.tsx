"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useWallet } from "@/providers/WalletProvider";
import { useEffect, useState } from "react";
import { Menu, X, Home, Lock, Handshake, ShieldCheck, BarChart3, Settings, LogOut, History as HistoryIcon, Zap, Globe, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";

export function Sidebar() {
  const pathname = usePathname();
  const { disconnectStacks } = useWallet();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => {
          if (data?.profile) setProfile(data.profile);
        })
        .catch(() => {});
    }
  }, [session?.user?.id]);

  const handleLogout = async () => {
    disconnectStacks();
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { label: "Overview", icon: Home, href: "/dashboard" },
    { label: "Protocol Ledger", icon: HistoryIcon, href: "/ledger" },
    { label: "How It Works", icon: Zap, href: "/how-it-works" },
    { label: "Philosophy", icon: Globe, href: "/philosophy" },
    { label: "The Vault", icon: Lock, href: "/vault/setup" },
    { label: "Security", icon: ShieldCheck, href: "/security" },
    { label: "Documentation", icon: Book, href: "/docs" },
  ];

  const systemItems = [
    { label: "Analytics", icon: BarChart3, href: "/analytics", status: 'Beta' },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const avatarUrl = profile?.avatarUrl;
  const displayName = profile?.displayName || session?.user?.name || "User";
  const username = profile?.username;
  const initials = displayName
    ? displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      {/* MOBILE HEADER (Top Bar) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background-dark/90 backdrop-blur-xl border-b border-white/5 z-50 px-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background-dark font-bold">
             <ShieldCheck size={18} />
          </div>
          <span className="font-tight font-bold text-sm tracking-tight text-white uppercase">IRONCLAD</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-widest mr-1">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lg:hidden fixed inset-0 z-40 pt-20 bg-background-dark/98 backdrop-blur-2xl"
          >
            <nav className="p-6 space-y-2 h-[calc(100vh-80px)] overflow-y-auto pb-24">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-4">Main Navigation</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-5 rounded-2xl transition-all relative ${
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-slate-400 border border-transparent"
                    }`}
                  >
                    <item.icon size={22} />
                    <span className="ml-4 font-black text-xs uppercase tracking-[0.15em]">{item.label}</span>
                    {(item as any).status && (
                       <span className="ml-auto text-[8px] font-black bg-white/5 px-2 py-1 rounded-md text-slate-500 uppercase tracking-tighter">{(item as any).status}</span>
                    )}
                  </Link>
                );
              })}

              <div className="px-2 pt-6 pb-4">
                 <div className="h-px w-full bg-white/5" />
              </div>
              
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-4">System</p>
              {systemItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-5 rounded-2xl transition-all relative ${
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-slate-400 border border-transparent"
                    }`}
                  >
                    <item.icon size={22} />
                    <span className="ml-4 font-black text-xs uppercase tracking-[0.15em]">{item.label}</span>
                    {(item as any).status && (
                       <span className="ml-auto text-[8px] font-black bg-white/5 px-2 py-1 rounded-md text-slate-500 uppercase tracking-tighter">{(item as any).status}</span>
                    )}
                  </Link>
                );
              })}
              
               {/* Mobile Profile Card */}
               <div className="mt-8 p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar 
                      src={avatarUrl} 
                      name={displayName} 
                      size={48} 
                      className="border-primary/20 shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">@{username || 'ironclad'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <Link
                       href="/settings"
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="py-3 bg-primary text-background-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                     >
                       <Settings size={14} /> Settings
                     </Link>
                     <button 
                       onClick={handleLogout}
                       className="py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
                     >
                       <LogOut size={14} /> Logout
                     </button>
                  </div>
               </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
        {[
          { label: "Home", icon: Home, href: "/dashboard" },
          { label: "Ledger", icon: HistoryIcon, href: "/ledger" },
          { label: "Vault", icon: Lock, href: "/vault/setup" },
          { label: "Security", icon: ShieldCheck, href: "/security" },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-primary' : 'text-slate-500'}`}
            >
              <item.icon size={18} className={isActive ? 'scale-110 text-primary' : 'opacity-70'} />
              <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-500 flex-1"
        >
          <Menu size={18} className="opacity-70" />
          <span className="text-[7px] font-black uppercase tracking-widest">More</span>
        </button>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-background-dark z-20 shrink-0 transition-all duration-300">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-background-dark font-bold shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <span className="ml-4 font-tight font-bold text-xl tracking-tight text-white uppercase">IRONCLAD</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-10 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`} size={18} />
                <span className="ml-4 text-sm font-bold tracking-tight">{item.label}</span>
                {(item as any).status && (
                   <span className={`ml-auto text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'}`}>
                      {(item as any).status}
                   </span>
                )}
              </Link>
            );
          })}
          
          <div className="px-5 pt-8 pb-4">
             <div className="h-px w-full bg-white/5" />
          </div>
          
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`} size={18} />
                <span className="ml-4 text-sm font-bold tracking-tight">{item.label}</span>
                {(item as any).status && (
                   <span className={`ml-auto text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'}`}>
                      {(item as any).status}
                   </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User Card */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-center gap-3 relative z-10 mb-4">
              <Avatar 
                src={avatarUrl} 
                name={displayName} 
                size={40} 
                className="border-primary/20 shrink-0" 
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">@{username || 'ironclad'}</p>
              </div>
            </div>

            <div className="flex gap-2 relative z-10">
              <Link
                href="/settings"
                className="flex-1 py-2 bg-primary text-background-dark text-[9px] font-bold rounded-lg hover:bg-white transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10"
              >
                <Settings size={12} /> SETTINGS
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 bg-white/5 border border-white/10 text-slate-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center shrink-0"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
