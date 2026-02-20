'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Wallet, 
  Calendar, 
  Settings, 
  Edit3, 
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';

export default function ProfileDetails({ user }: { user: any }) {
  const profile = user.profile;

  const truncate = (str: string) => str ? `${str.slice(0, 6)}...${str.slice(-4)}` : 'Not linked';

  return (
    <div className="space-y-8">
      {/* Header / Hero */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative glass-panel p-10 rounded-[3rem] border-white/10 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-glass border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            <Link 
              href="/settings"
              className="absolute bottom-[-10px] right-[-10px] bg-white text-black p-2.5 rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            >
              <Edit3 size={18} />
            </Link>
          </div>
 
          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl font-bold font-tight text-white">{profile.displayName}</h1>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 w-fit mx-auto md:mx-0 uppercase tracking-widest">PRO MEMBER</span>
            </div>
            <p className="text-muted-silver font-mono text-lg">@{profile.username}</p>
            <p className="text-muted-silver max-w-md line-clamp-2">{profile.bio || "No bio set yet. Tell the protocol about yourself."}</p>
          </div>
 
          <Link 
            href="/settings"
            className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl border border-white/10 transition-all flex items-center gap-2"
          >
            <Settings size={20} />
            Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity & Security */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Shield className="text-primary" size={24} />
              Identity & Security
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard 
                icon={Mail} 
                label="Primary Email" 
                value={user.email || 'Not verified'} 
                status={user.isEmailVerified ? 'Verified' : 'Pending'} 
              />
              <InfoCard 
                icon={Wallet} 
                label="Vault Address" 
                value={truncate(user.walletAddress)} 
                isMono 
              />
              <InfoCard 
                icon={Globe} 
                label="Region / Locale" 
                value={`${profile.country || 'Unknown'} (${profile.timezone || 'UTC'})`} 
              />
              <InfoCard 
                icon={Calendar} 
                label="Member Since" 
                value={new Date(user.createdAt).toLocaleDateString()} 
              />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Lock className="text-primary" size={24} />
                Linked Providers
              </h2>
            </div>
            <div className="space-y-4">
              {['Email', 'Google', 'Stacks Wallet'].map((provider) => (
                <div key={provider} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      {provider === 'Google' ? <Globe size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{provider}</p>
                      <p className="text-xs text-muted-silver">Connected via {provider.toLowerCase()}</p>
                    </div>
                  </div>
                  <button className="text-muted-silver hover:text-white transition-all group-hover:translate-x-1">
                    <ExternalLink size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 bg-linear-to-br from-primary/5 to-transparent">
            <h3 className="text-lg font-bold mb-4">Vault Reputation</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-white">942</span>
                <span className="text-primary text-xs font-bold leading-relaxed">+12% this month</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-xs text-muted-silver leading-relaxed">
                Your Tier 2 standing qualifies you for 0.5% lower protocol fees on sBTC transitions.
              </p>
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-white text-black font-bold py-5 rounded-4xl transition-all shadow-2xl shadow-primary/10">
            Export Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, status, isMono }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
      <div className="flex items-center justify-between mb-1">
        <Icon size={16} className="text-muted-silver" />
        {status && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'Verified' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            {status}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-muted-silver uppercase tracking-widest">{label}</p>
      <p className={`text-white font-bold leading-none ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
