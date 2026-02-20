import { useState, useEffect } from 'react';
import { getUserSession } from '@/lib/stacks/client';

export const useStacks = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await getUserSession();
        if (session.isUserSignedIn()) {
          setUserData(session.loadUserData());
        } else if (session.isSignInPending()) {
          const data = await session.handlePendingSignIn();
          setUserData(data);
        }
      } catch (err) {
        console.error('Failed to initialize Stacks session:', err);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    const session = await getUserSession();
    const { showConnect } = await import('@stacks/connect');
    showConnect({
      appDetails: {
        name: 'Ironclad Protocol',
        icon: '/logo.png',
      },
      userSession: session,
      onFinish: () => {
        setUserData(session.loadUserData());
        window.location.reload();
      },
    });
  };

  const disconnect = async () => {
    const session = await getUserSession();
    session.signUserOut();
    setUserData(null);
  };

  return {
    userData,
    isSignedIn: !!userData,
    address: userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet,
    connectWallet,
    disconnect,
  };
};
