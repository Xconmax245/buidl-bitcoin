"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateWallet } from "@/components/wallet/CreateWallet";
import AuthPage from "@/components/auth/AuthPage";
import ProfileSetupModal from "@/components/auth/ProfileSetupModal";
import { useSession } from "next-auth/react";
import { useWallet } from "@/providers/WalletProvider";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { hasWallet, isUnlocked, isLoading: walletLoading } = useWallet();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const res = await fetch("/api/profile/check");
          if (res.ok) {
            const data = await res.json();
            setHasProfile(data.exists);
          } else {
            setHasProfile(false);
          }
        } catch (err) {
          console.error("Profile check failed", err);
          setHasProfile(false);
        }
      }
    };
    checkProfile();
  }, [session, status]);

  // Redirect if already fully onboarded or if it's a demo session that doesn't require a new vault
  useEffect(() => {
    const isDemo = session?.user?.email === "demo@ironclad.finance";
    const isReady = status === "authenticated" && hasProfile === true && !walletLoading;
    
    if (isReady && (hasWallet && isUnlocked || isDemo)) {
      console.log("Onboarding complete, navigating to dashboard...");
      router.push("/dashboard");
    }
  }, [status, hasProfile, hasWallet, isUnlocked, walletLoading, router, session]);

  if (status === "loading" || (status === "authenticated" && hasProfile === null)) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-mono text-xs uppercase tracking-widest animate-pulse">Syncing Protocol Status...</p>
        </motion.div>
      </div>
    );
  }

  // Phase 1: Authentication & Vault Unlocking
  if (status === "unauthenticated" || (hasWallet && !isUnlocked)) {
    return (
      <AuthPage 
        key="auth-phase" 
        onSuccess={() => {
          console.log("Auth success, refreshing onboarding...");
          router.refresh();
        }} 
      />
    );
  }

  // Phase 2: Profile Setup
  if (!hasProfile) {
    return (
      <ProfileSetupModal 
        key="profile-phase"
        userEmail={session?.user?.email ?? undefined} 
        onComplete={() => {
          setHasProfile(true);
          router.refresh();
        }} 
      />
    );
  }

  // Phase 3: Vault / Wallet Creation
  return (
    <div key="wallet-phase">
      <CreateWallet onComplete={() => {
        router.refresh();
        router.push("/dashboard");
      }} />
    </div>
  );
}
