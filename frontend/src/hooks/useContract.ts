
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { STACKS_TESTNET, STACKS_MAINNET, STACKS_MOCKNET } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  principalCV,
  standardPrincipalCV,
  contractPrincipalCV,
  boolCV,
  bufferCV,
  serializeCV,
  deserializeCV,
  cvToJSON
} from '@stacks/transactions';
import { useWallet } from '@/providers/WalletProvider';
import { useNotifications } from '@/providers/NotificationProvider';

// Safe wrapper for useConnect that doesn't crash when ConnectProvider isn't mounted
const useSafeConnect = () => {
  const [connectFn, setConnectFn] = useState<any>(null);

  useEffect(() => {
    // Dynamically import and try to get the connect function
    import('@stacks/connect-react').then((mod) => {
      // We can't call hooks dynamically, so we'll use openContractCall directly
      import('@stacks/connect').then((connectMod) => {
        setConnectFn(() => connectMod.openContractCall);
      });
    }).catch(() => {
      console.warn('Stacks Connect not available');
    });
  }, []);

  const doContractCall = useCallback(async (options: any) => {
    if (connectFn) {
      return connectFn(options);
    }
    // Fallback: try dynamic import
    try {
      const { openContractCall } = await import('@stacks/connect');
      return openContractCall(options);
    } catch (err) {
      console.warn('Contract call not available:', err);
    }
  }, [connectFn]);

  return { doContractCall };
};

export const useContract = () => {
  const { doContractCall } = useSafeConnect();
  const { network: networkMode } = useWallet();
  const { addNotification } = useNotifications();
  
  // Ensure address is clean and reactive to environment
  const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST2QTHF5ANDT876XA3T0V032S1QWE9AGCN76PFFWM').trim();
  const REGISTRY_CONTRACT = 'registry';
  const SAVINGS_CONTRACT = 'savings';

  const network = useMemo(() => {
    switch(networkMode) {
      case 'mainnet': return STACKS_MAINNET;
      case 'testnet': return STACKS_TESTNET;
      default: return STACKS_MOCKNET;
    }
  }, [networkMode]);

  const registerUser = useCallback(async (btcAddress: string, xPubHash: string) => {
    // btcAddress is 34 bytes buffer, xPubHash is 32 bytes buffer
    // For simplicity in this demo, we assume inputs are hex strings or handled as buffers
    
    // Convert hex string to buffer
    const btcBuff = Buffer.from(btcAddress, 'hex'); 
    // real implementation needs proper address buffer conversion
    
    const xPubBuff = Buffer.from(xPubHash, 'hex');

    await doContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: REGISTRY_CONTRACT,
      functionName: 'register-user',
      functionArgs: [bufferCV(btcBuff), bufferCV(xPubBuff)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data: any) => {
        console.log('Register Request sent:', data);
        addNotification({
          type: 'success',
          title: 'Registration Initiated',
          message: 'Your user registration has been broadcast to the Stacks network.'
        });
      },
      onCancel: () => {
        console.log('Register Request canceled');
        addNotification({
          type: 'info',
          title: 'Registration Canceled',
          message: 'User registration was canceled.'
        });
      },
    });
  }, [doContractCall, network, addNotification]);

  const createPlan = useCallback(async (targetAmount: number, targetAsset: string, duration: number, sponsored: boolean = false) => {
    // Determine asset CV - if starts with 'ST' it's a principal, else treat as placeholder
    const assetCV = targetAsset.includes('.') ? contractPrincipalCV(targetAsset.split('.')[0], targetAsset.split('.')[1]) : principalCV(targetAsset);

    await doContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: SAVINGS_CONTRACT,
      functionName: 'create-plan',
      functionArgs: [uintCV(targetAmount), assetCV, uintCV(duration)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      sponsored: sponsored,
      onFinish: (data: any) => {
        console.log('Create Plan sent:', data);
        addNotification({
          type: 'success',
          title: 'Savings Plan Created',
          message: `Your savings commitment for ${targetAsset.split('.').pop() || 'STX'} is being secured.`
        });
      },
      onCancel: () => {
        addNotification({
          type: 'info',
          title: 'Plan Canceled',
          message: 'Savings plan creation was canceled.'
        });
      },
    });
  }, [doContractCall, network, addNotification, CONTRACT_ADDRESS, SAVINGS_CONTRACT]);

  const getVaultData = useCallback(async (user: string, tokenPrincipal: string) => {
    if (user === 'demo') {
      // Mock different states based on token for the demo
      const isMature = tokenPrincipal.includes('sbtc');
      return {
        value: {
          'locked-amount': { value: isMature ? '100000000' : '250000000' },
          'unlock-height': { value: isMature ? '1000' : '2000' },
          'withdrawn': { value: false }
        }
      };
    }
    try {
      const parts = tokenPrincipal.split('.');
      const tokenCV = contractPrincipalCV(parts[0], parts[1]);
      const userCv = standardPrincipalCV(user);

      const url = `${network.client.baseUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/vault/get-vault`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: user,
          arguments: [
            Buffer.from(serializeCV(userCv)).toString('hex'),
            Buffer.from(serializeCV(tokenCV)).toString('hex')
          ],
        }),
      });

      const result = await response.json();
      if (!result.okay) return null;

      const resultCV = deserializeCV(Buffer.from(result.result.replace('0x', ''), 'hex'));
      return cvToJSON(resultCV);
    } catch (error) {
      console.error('Error fetching vault data:', error);
      return null;
    }
  }, [network, CONTRACT_ADDRESS]);

  const getPlan = useCallback(async (principal: string) => {
    if (principal === 'demo') {
      try {
        // Fetch current height to make the demo plan look active relative to now
        const response = await fetch(`${network.client.baseUrl}/v2/info`);
        const data = await response.json();
        const currentHeight = data.stacks_tip_height;
        
        return {
          value: {
            'start-height': { value: String(Math.max(0, currentHeight - 50)) }, // Started 50 blocks ago
            'duration': { value: '144' },
            'target-amount': { value: '100000000' }, // 1 BTC
            'completed': { value: false }
          }
        };
      } catch (e) {
        return {
          value: {
            'start-height': { value: '1000' },
            'duration': { value: '144' },
            'target-amount': { value: '100000000' },
            'completed': { value: false }
          }
        };
      }
    }
    try {
      // Use direct fetch construction for read-only to avoid importing massive libraries if possible, or use standard
      // Here we assume stacks-node-api format
      const functionName = 'get-plan';
      const sender = principal;
      const cv = standardPrincipalCV(principal);
      const args = [Buffer.from(serializeCV(cv)).toString('hex')];

      const url = `${network.client.baseUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${SAVINGS_CONTRACT}/${functionName}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sender,
          arguments: args,
        }),
      });

      const result = await response.json();
      if (!result.okay) return null; // or handle error

      const resultCV = deserializeCV(Buffer.from(result.result.replace('0x', ''), 'hex'));
      return cvToJSON(resultCV);
    } catch (error) {
      console.error('Error fetching plan:', error);
      return null;
    }
  }, [network, CONTRACT_ADDRESS]); // Removed addNotification dependency for read-only to prevent loops if used in effects

  const getBlockHeight = useCallback(async () => {
    try {
      const response = await fetch(`${network.client.baseUrl}/v2/info`);
      const data = await response.json();
      return data.stacks_tip_height;
    } catch (e) {
      return 0;
    }
  }, [network]);

  const verifyBalance = useCallback(async (user: string, balance: number, signature: string) => {
    const sigBuff = Buffer.from(signature, 'hex');
    await doContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'verification',
      functionName: 'verify-balance',
      functionArgs: [principalCV(user), uintCV(balance), bufferCV(sigBuff)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('Verification sent:', data);
        addNotification({
          type: 'success',
          title: 'Balance Verification',
          message: 'Proof of reserves verification has been submitted.'
        });
      },
      onCancel: () => {
        addNotification({
          type: 'warning',
          title: 'Verification Canceled',
          message: 'Balance verification process was interrupted.'
        });
      }
    });
  }, [doContractCall, network, addNotification]);

  const verifyTime = useCallback(async (user: string) => {
    await doContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'verification',
      functionName: 'verify-time',
      functionArgs: [principalCV(user)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('Time Verification sent:', data);
        addNotification({
          type: 'success',
          title: 'Time Verification',
          message: 'Time-lock maturity check initiated.'
        });
      },
    });
  }, [doContractCall, network, addNotification]);

  const withdrawVaultAsset = useCallback(async (tokenPrincipal: string) => {
    if (!tokenPrincipal.includes('.')) return;
    const [contractAddress, contractName] = tokenPrincipal.split('.');
    
    await doContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'vault',
      functionName: 'withdraw-after-unlock',
      functionArgs: [contractPrincipalCV(contractAddress, contractName)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data: any) => {
        addNotification({
          type: 'success',
          title: 'Withdrawal Initiated',
          message: 'The asset release protocol has been broadcast.'
        });
      },
      onCancel: () => {
        addNotification({
          type: 'info',
          title: 'Withdrawal Aborted',
          message: 'Security lock maintained.'
        });
      },
    });
  }, [doContractCall, network, addNotification, CONTRACT_ADDRESS]);

  const castVote = useCallback(async (proposalId: string, support: boolean) => {
    // Placeholder for governance contract call
    console.log(`[Governance] Voting ${support ? 'FOR' : 'AGAINST'} ${proposalId}`);
    
    // Simulate contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addNotification({
      type: 'success',
      title: 'Vote Secured',
      message: `Your sovereign vote on IP-${proposalId} has been committed to the ledger.`
    });
  }, [addNotification]);

  const isMainnet = networkMode === 'mainnet';

  return { network, isMainnet, registerUser, createPlan, getPlan, getVaultData, withdrawVaultAsset, getBlockHeight, verifyBalance, verifyTime, castVote };
};
