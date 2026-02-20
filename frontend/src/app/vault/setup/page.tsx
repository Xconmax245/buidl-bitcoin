"use client";
import { useWallet } from "@/providers/WalletProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { VaultProgress } from "@/components/vault/VaultProgress";
import { DurationStep } from "@/components/vault/DurationStep";
import { AllocationStep } from "@/components/vault/AllocationStep";
import { ConfirmStep } from "@/components/vault/ConfirmStep";
import { AnimatePresence } from "framer-motion";
import { useContract } from "@/hooks/useContract";

export default function VaultSetupPage() {
  const { isUnlocked, address } = useWallet();
  const { isLoading, isFullyOnboarded, redirectToOnboarding } = useOnboarding();
  const { createPlan } = useContract(); // Hook for smart contract
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [vaultData, setVaultData] = useState({
    duration: 12,
    penalty: 25,
    targetAmount: 100000, // default satoshis
    targetAsset: 'sBTC' // Default to sBTC
  });

  useEffect(() => {
    if (!isLoading && isFullyOnboarded === false) {
      redirectToOnboarding();
    }
  }, [isLoading, isFullyOnboarded, redirectToOnboarding]);

  if (isLoading || isFullyOnboarded === null) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isFullyOnboarded) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <VaultProgress 
          step={step} 
          onAbort={() => router.push('/dashboard')}
        />

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-24 md:p-8 lg:p-12 scroll-smooth relative">
          {/* Background Ambient Effects - Muted */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
             <div className="absolute top-[10%] left-[10%] w-[40%] h-[30%] bg-primary/2 rounded-full blur-[80px]" />
             <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] bg-white/2 rounded-full blur-[60px]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto py-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <DurationStep 
                  key="step1"
                  onNext={(d) => {
                    setVaultData({ ...vaultData, duration: d });
                    nextStep();
                  }}
                  onPrev={() => router.push('/dashboard')}
                />
              )}
              
              {step === 2 && (
                <AllocationStep 
                  key="step2"
                  duration={vaultData.duration}
                  address={address}
                  onNext={(p, amt, asset) => {
                    setVaultData({ ...vaultData, penalty: p, targetAmount: amt, targetAsset: asset });
                    nextStep();
                  }}
                  onPrev={prevStep}
                />
              )}

              {step === 3 && (
                <ConfirmStep 
                  key="step3"
                  duration={vaultData.duration}
                  penalty={vaultData.penalty}
                  address={address}
                  onConfirm={async (sponsored) => {
                    try {
                      // Convert duration (months) to blocks. 
                      // 1 month ~ 4320 blocks (10 min blocks).
                      const blocks = vaultData.duration * 4320; 
                      
                      // Call Stacks contract - Real Execution with Optional Sponsoring
                      await createPlan(vaultData.targetAmount, vaultData.targetAsset, blocks, sponsored);
                      
                      console.log("Vault Sealed on Stacks:", vaultData);
                      router.push('/dashboard'); 
                    } catch (e) {
                      console.error("Plan creation failed", e);
                      throw e; // Handled by ConfirmStep toast
                    }
                  }}
                  onPrev={prevStep}
                />
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-20 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-transparent opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Interface</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(169,208,195,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Non-Custodial Logic</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 grayscale opacity-50">
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-lg">SOC2_COMPLIANT</div>
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-lg">QUANTUM_RESISTANT</div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
