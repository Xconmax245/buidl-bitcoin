import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/providers/WalletProvider';

export function useOnboarding() {
  const { status, data: session } = useSession();
  const { hasWallet, isUnlocked, isLoading: walletLoading } = useWallet();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isFullyOnboarded, setIsFullyOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      if (status === "loading" || walletLoading) return;

      if (status === "unauthenticated") {
        setIsFullyOnboarded(false);
        return;
      }

      if (!hasWallet) {
        setIsFullyOnboarded(false);
        return;
      }

      try {
        const res = await fetch("/api/profile/check");
        if (res.ok) {
          const data = await res.json();
          setHasProfile(data.exists);
          // Demo users are fully onboarded if they have a profile (which they always do)
          setIsFullyOnboarded(data.exists && hasWallet && isUnlocked);
        } else {
          setHasProfile(false);
          setIsFullyOnboarded(false);
        }
      } catch (err) {
        console.error("Profile check failed", err);
        setHasProfile(false);
        setIsFullyOnboarded(false);
      }
    };

    checkStatus();
  }, [status, hasWallet, isUnlocked, walletLoading, session]);

  const redirectToOnboarding = () => {
    router.push('/onboarding');
  };

  return {
    status,
    hasWallet,
    hasProfile,
    isFullyOnboarded,
    isLoading: status === "loading" || walletLoading || (status === "authenticated" && hasProfile === null),
    redirectToOnboarding
  };
}
