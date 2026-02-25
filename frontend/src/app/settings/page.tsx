"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationsModal } from "@/components/notifications/NotificationsModal";
import { 
  User, 
  Shield, 
  Globe, 
  Coins, 
  Save, 
  ArrowLeft,
  Camera,
  Cpu,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Bell,
  Fingerprint,
  Database,
  KeyRound,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useWallet } from "@/providers/WalletProvider";
import { useNotifications } from "@/providers/NotificationProvider";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/Avatar";
import { COUNTRIES, TIMEZONES, CURRENCIES, LANGUAGES, DEFAULT_AVATARS } from "@/lib/constants";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { status, isLoading, isFullyOnboarded, redirectToOnboarding } = useOnboarding();
  const { network, setNetworkMode, deleteWallet, walletType } = useWallet();
  const { unreadCount, toggleOpen } = useNotifications();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'protocol' | 'security' | 'privacy' | 'sync'>('profile');
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (!isLoading && isFullyOnboarded === false) {
      redirectToOnboarding();
      return;
    }
    
    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setProfileLoading(false);
      router.push("/auth/signin");
    }
  }, [status, isLoading, isFullyOnboarded]);

  const fetchProfile = async () => {
    console.log("[Protocol] Initiating Cloud Sync...");
    try {
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) throw new Error("Cloud handshake failed");
      
      const userData = await userRes.json();
      console.log("[Protocol] Recovery data acquired:", userData);
      
      if (userData?.profile) {
        setProfile({
          ...userData.profile,
          leaderboardVisible: userData.profile?.leaderboardVisible ?? true,
          notificationsEnabled: userData.profile?.notificationsEnabled ?? true,
          priorityFee: userData.profile?.priorityFee ?? 'standard',
          autoPersistence: userData.profile?.autoPersistence ?? true
        });
      } else {
        console.warn("[Protocol] Identity matrix missing. Initializing fallback.");
        setProfile({
          displayName: session?.user?.name || "Ironclad User",
          username: "",
          avatarUrl: session?.user?.image || "",
          bio: "",
          leaderboardVisible: true,
          notificationsEnabled: true,
          priorityFee: 'standard',
          autoPersistence: true
        });
      }
    } catch (err) {
      console.error("[Protocol] Critical Sync Failure:", err);
      toast.error("Cloud sync failed. Operating in local mode.");
      setProfile({
        displayName: session?.user?.name || "Local Identity",
        leaderboardVisible: true,
        notificationsEnabled: true,
        priorityFee: 'standard',
        autoPersistence: true
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      toast.error("Identity matrix not loaded.");
      return;
    }
    
    console.log("[Protocol] Broadcasting identity update...", profile);
    setSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Settings synchronized with Ironclad Protocol");
      } else {
        const errorText = await res.text().catch(() => "Could not read error body");
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        console.error(`[Protocol] Sync Rejected (Status ${res.status}):`, errorData);
        toast.error("Failed to synchronize settings");
      }
    } catch (err) {
      console.error("[Protocol] Network failure in broadcast:", err);
      toast.error("Network error during synchronization");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || (profileLoading && status !== 'unauthenticated')) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
           <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] animate-pulse">Initializing Protocol State</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'protocol', label: 'Protocol', icon: Cpu },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'sync', label: 'Cloud Sync', icon: Database },
  ];

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      <NotificationsModal />
      
      <main className="flex-1 overflow-y-auto relative bg-glow pt-16 lg:pt-0">
        {/* Floating Mobile Notification Button */}
        <div className="lg:hidden fixed bottom-8 right-8 z-50">
           <button 
             onClick={toggleOpen}
             className="w-14 h-14 bg-primary rounded-full shadow-[0_0_20px_rgba(169,208,195,0.4)] flex items-center justify-center text-background-dark active:scale-90 transition-transform relative border-2 border-white/10"
           >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-background-dark flex items-center justify-center text-[10px] font-black text-white">
                   {unreadCount}
                </span>
              )}
           </button>
        </div>
        <div className="max-w-5xl mx-auto px-5 pt-28 pb-12 lg:py-20 lg:px-10">
          
          {/* Header */}
          <header className="mb-12">
             <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return
            </motion.button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-tight font-bold text-white mb-3">Protocol Settings</h1>
                <p className="text-slate-400 text-sm md:text-lg max-w-xl leading-relaxed">Configure your autonomous savings environment and identity parameters.</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-white text-background-dark font-bold transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-background-dark/20 border-t-background-dark rounded-full animate-spin" />
                ) : (
                  <>
                    <Database size={18} className="group-hover:scale-110 transition-transform" />
                    Sync Changes
                  </>
                )}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-3 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${
                    activeTab === tab.id 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                    : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/10"
                >
                  {/* PROFILE TAB */}
                  {activeTab === 'profile' && (
                    <div className="space-y-10">
                      <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="relative group">
                          <Avatar 
                            src={profile.avatarUrl} 
                            name={profile.displayName || 'User'} 
                            size={96} 
                            className="bg-glass border-2 border-primary/20 transition-transform group-hover:scale-105" 
                          />
                           <button 
                             onClick={() => setIsAvatarModalOpen(true)}
                             className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-background-dark rounded-xl shadow-xl hover:scale-110 transition-transform"
                           >
                             <Camera size={14} />
                           </button>
                         </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Identity Profile</h3>
                          <p className="text-sm text-slate-500">Your public appearance across the Ironclad ecosystem.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                          <input 
                            type="text"
                            value={profile.displayName || ''}
                            onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-primary transition-all font-medium"
                            placeholder="Enter display name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Username</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">@</span>
                            <input 
                              type="text"
                              value={profile.username || ''}
                              onChange={(e) => setProfile({...profile, username: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-5 text-white outline-none focus:border-primary transition-all font-mono"
                              placeholder="username"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Protocol Bio</label>
                          <textarea 
                            value={profile.bio || ''}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-primary transition-all h-28 resize-none text-sm leading-relaxed"
                            placeholder="Describe your commitment to the protocol..."
                          />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Country</label>
                          <select
                            value={profile.country || ''}
                            onChange={(e) => setProfile({...profile, country: e.target.value})}
                            className="w-full bg-[#0c1210] border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-primary transition-all font-medium appearance-none"
                          >
                            <option value="">Select country...</option>
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Timezone */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Timezone</label>
                          <select
                            value={profile.timezone || ''}
                            onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                            className="w-full bg-[#0c1210] border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-primary transition-all font-medium appearance-none"
                          >
                            <option value="">Select timezone...</option>
                            {TIMEZONES.map((tz) => (
                              <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Display Currency</label>
                          <div className="flex flex-wrap gap-2">
                            {CURRENCIES.map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => setProfile({...profile, preferredCurrency: curr})}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  profile.preferredCurrency === curr
                                    ? 'bg-primary text-background-dark shadow-md'
                                    : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'
                                }`}
                              >
                                {curr}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Language</label>
                          <select
                            value={profile.language || 'EN'}
                            onChange={(e) => setProfile({...profile, language: e.target.value})}
                            className="w-full bg-[#0c1210] border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-primary transition-all font-medium appearance-none"
                          >
                            {LANGUAGES.map((lang) => (
                              <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PROTOCOL TAB */}
                  {activeTab === 'protocol' && (
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Mainnet Protocol Status</h3>
                        <p className="text-sm text-slate-500 mb-8">Toggle between production and staging environments.</p>
                        
                        <div className="grid grid-cols-2 gap-4 bg-white/2 p-2 rounded-2xl border border-white/5 max-w-sm">
                          <button 
                            onClick={() => setNetworkMode('mainnet')}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${network === 'mainnet' ? 'bg-primary text-background-dark shadow-lg shadow-primary/10' : 'text-slate-500 hover:text-white'}`}
                          >
                            MAINNET
                          </button>
                          <button 
                            onClick={() => setNetworkMode('testnet')}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${network === 'testnet' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                          >
                            TESTNET
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-4 italic">Switching networks will change your derived Bitcoin and Stacks addresses.</p>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6">Transaction Priority</h3>
                        <div className="space-y-4">
                          {[
                            { id: 'relaxed', label: 'Relaxed', fee: '1-2 sats/vB', desc: 'Optimal for long-term vault sealing' },
                            { id: 'standard', label: 'Standard', fee: '5-10 sats/vB', desc: 'Recommended balance of cost and speed' },
                            { id: 'aggressive', label: 'Aggressive', fee: '25+ sats/vB', desc: 'Priority inclusion in the next block' },
                          ].map((fee) => (
                            <button
                              key={fee.id}
                              onClick={() => setProfile({...profile, priorityFee: fee.id})}
                              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left group ${
                                profile.priorityFee === fee.id 
                                ? "bg-primary/5 border-primary/30" 
                                : "bg-white/2 border-white/5 hover:border-white/10"
                              }`}
                            >
                              <div>
                                <p className={`font-bold text-sm ${profile.priorityFee === fee.id ? 'text-primary' : 'text-white'}`}>{fee.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{fee.desc}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-mono font-bold text-slate-400">{fee.fee}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECURITY TAB */}
                  {activeTab === 'security' && (
                    <div className="space-y-10">
                      <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
                        
                        <div className="flex items-start gap-5 relative z-10">
                          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <KeyRound size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">Recovery Seed Phrase</h3>
                            <p className="text-sm text-primary/70 mb-6 leading-relaxed">Your recovery phrase is the ultimate master key for your vault assets. Store it offline and never share it.</p>
                            <button 
                              onClick={() => toast.info("Check your secure hardware or local vault backup.")}
                              className="px-6 py-2.5 bg-primary text-background-dark text-xs font-bold rounded-xl hover:bg-white transition-all shadow-lg"
                            >
                              VIEW BACKUP STATUS
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 text-white font-bold text-sm">
                            <Fingerprint size={18} className="text-primary" />
                            Biometric Lock
                          </div>
                          <p className="text-xs text-slate-500">Require local authentication for sensitive vault operations.</p>
                          <div className="flex items-center gap-2">
                             <div className="w-10 h-5 bg-slate-800 rounded-full relative p-1 cursor-not-allowed">
                               <div className="w-3 h-3 bg-slate-600 rounded-full" />
                             </div>
                             <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Disabled in Browser</span>
                          </div>
                        </div>
                        
                        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 text-white font-bold text-sm">
                            <Bell size={18} className="text-primary" />
                            Security Alerts
                          </div>
                          <p className="text-xs text-slate-500">Enable real-time notifications for protocol interactions.</p>
                          <button 
                            onClick={() => setProfile({...profile, notificationsEnabled: !profile.notificationsEnabled})}
                            className={`w-10 h-5 rounded-full relative p-1 transition-all flex items-center ${profile.notificationsEnabled ? 'bg-primary' : 'bg-slate-800'}`}
                          >
                             <div className={`w-3 h-3 bg-white rounded-full transition-all ${profile.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                          <Trash2 size={16} /> Danger Zone
                        </h4>
                        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                              <p className="text-white font-bold text-sm mb-1">Clear Local Identity Cache</p>
                              <p className="text-xs text-slate-500 max-w-sm">This will permanently delete your local wallet and preferences. Your on-chain vault remains safe.</p>
                            </div>
                            <button 
                              onClick={() => {
                                if(confirm("Are you sure? This will delete your local wallet state.")) {
                                  deleteWallet();
                                  router.push('/');
                                }
                              }}
                              className="px-6 py-3 bg-red-500/20 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            >
                              DELETE LOCAL DATA
                            </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRIVACY TAB */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-10">
                       <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 flex flex-col md:flex-row items-center gap-8 group">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                            {profile.leaderboardVisible ? <Eye size={32} /> : <EyeOff size={32} />}
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-white mb-2 underline decoration-indigo-500/30 underline-offset-4">Protocol Visibility</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">When enabled, your reputation score and total value locked will be visible on the global Ironclad leaderboards.</p>
                            
                            <button 
                              onClick={() => setProfile({...profile, leaderboardVisible: !profile.leaderboardVisible})}
                              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
                                profile.leaderboardVisible 
                                ? "bg-indigo-500 text-white shadow-indigo-500/20" 
                                : "bg-white/5 text-slate-400"
                              }`}
                            >
                              {profile.leaderboardVisible ? 'PUBLIC STATUS: ENABLED' : 'PRIVATE STATUS: HIDDEN'}
                            </button>
                          </div>
                       </div>

                       <div className="pt-8 space-y-8">
                         <div className="flex items-center justify-between p-6 rounded-3xl bg-white/2 border border-white/5">
                           <div>
                             <p className="text-white font-bold text-sm mb-1">Encrypted Communication</p>
                             <p className="text-xs text-slate-500">Encrypt all system-to-user messages using Stacks public keys.</p>
                           </div>
                           <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-bold border border-green-500/20 uppercase">Always On</span>
                         </div>
                         
                         <div className="flex items-center justify-between p-6 rounded-3xl bg-white/2 border border-white/5 opacity-50 cursor-not-allowed">
                           <div>
                             <p className="text-white font-bold text-sm mb-1">Stealth Metadata</p>
                             <p className="text-xs text-slate-500">Omit timestamp and blockheight metadata from public logs.</p>
                           </div>
                           <span className="text-[10px] bg-white/10 text-slate-400 px-3 py-1 rounded-full font-bold uppercase">Pro Feature</span>
                         </div>
                       </div>
                    </div>
                  )}

                  {/* SYNC TAB */}
                  {activeTab === 'sync' && (
                    <div className="space-y-10">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <Database size={24} />
                          </div>
                          <div>
                             <h3 className="text-xl font-bold text-white">Cloud Heartbeat</h3>
                             <p className="text-sm text-slate-500">Manage how your profile persists across the protocol.</p>
                          </div>
                       </div>

                       <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-8">
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connection Status</p>
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                   <p className="text-sm font-bold text-white">IRONCLAD_CLOUD_ACTIVE</p>
                                </div>
                             </div>
                             <div className="text-right space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Heartbeat</p>
                                <p className="text-xs font-mono text-slate-300">{mounted ? new Date().toLocaleTimeString() : 'SYNCHRONIZING...'}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             {[
                                { label: 'Metadata Sync', status: 'ACTIVE', color: 'text-green-500' },
                                { label: 'Avatar Matrix', status: 'SYNCED', color: 'text-primary' },
                                { label: 'Gov. Params', status: 'ACTIVE', color: 'text-green-500' },
                             ].map((s) => (
                                <div key={s.label} className="p-4 bg-background-dark/50 rounded-2xl border border-white/5 space-y-2">
                                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
                                   <p className={`text-[10px] font-bold uppercase ${s.color}`}>{s.status}</p>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-6 pt-4">
                          <div className="flex items-center justify-between p-6 rounded-3xl bg-white/2 border border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                  <Save size={18} />
                               </div>
                               <div>
                                 <p className="text-white font-bold text-sm mb-1">Automatic Persistence</p>
                                 <p className="text-xs text-slate-500">Instantly broadcast local changes to the cloud vault.</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => setProfile({...profile, autoPersistence: !profile.autoPersistence})}
                              className={`w-10 h-5 rounded-full relative p-1 transition-all flex items-center ${profile.autoPersistence ? 'bg-primary' : 'bg-slate-800'}`}
                            >
                               <div className={`w-3 h-3 bg-white rounded-full transition-all ${profile.autoPersistence ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          <div className="p-6 rounded-3xl border border-orange-500/20 bg-orange-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                             <div className="flex items-center gap-4 text-center md:text-left">
                                <AlertCircle size={20} className="text-orange-500 shrink-0" />
                                <div>
                                   <p className="text-white font-bold text-sm mb-1">Force Protocol Re-sync</p>
                                   <p className="text-xs text-slate-500">Bypass local cache and perform a clean state refresh from the Ironclad Protocol.</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => {
                                  console.log("[Protocol] Manual Re-initialization Triggered");
                                  setProfileLoading(true);
                                  fetchProfile();
                                  toast.success("Protocol state refreshed");
                               }}
                               className="px-6 py-3 bg-orange-500 text-background-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-orange-500/10 shrink-0"
                             >
                               RE-INITIALIZE
                             </button>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 text-center">
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Ironclad Protocol v1.4.2-stable</p>
          </footer>
        </div>
      </main>

      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute inset-0 bg-background-dark/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">Select Identity Matrix</h2>
              
              <div className="grid grid-cols-4 gap-3 mb-8">
                {DEFAULT_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setProfile({ ...profile, avatarUrl: url });
                      setIsAvatarModalOpen(false);
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      profile.avatarUrl === url ? 'border-primary outline outline-offset-2 outline-primary/30' : 'border-white/5 grayscale hover:grayscale-0'
                    }`}
                  >
                    <img src={url} alt="Matrix" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-white/5"></div>
                   </div>
                   <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                     <span className="bg-background-dark px-4">Custom Feed</span>
                   </div>
                </div>
                
                <input 
                  type="text"
                  placeholder="Paste image URL here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary transition-all font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setProfile({ ...profile, avatarUrl: e.currentTarget.value });
                      setIsAvatarModalOpen(false);
                    }
                  }}
                />
              </div>

              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full mt-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                Close Matrix
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
