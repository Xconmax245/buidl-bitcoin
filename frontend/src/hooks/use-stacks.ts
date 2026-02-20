import { useState, useEffect } from 'react';
import { userSession } from '@/lib/stacks/client';
import { showConnect } from '@stacks/connect';

export const useStacks = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
      });
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Bitcoin Savings Protocol',
        icon: '/logo.png',
      },
      userSession,
      onFinish: () => {
        setUserData(userSession.loadUserData());
        window.location.reload();
      },
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
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
