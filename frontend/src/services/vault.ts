import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  PostConditionMode
} from '@stacks/transactions';
import { getNetwork, CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/stacks/client';

export const depositSBTC = async (amount: number) => {
  const network = getNetwork();
  
  // Example post-condition for safety
  // In a real app, you'd specify the sBTC token details
  
  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'deposit',
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Allow, // For simplified mock
    onFinish: (data) => {
      console.log('Transaction sent:', data.txId);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
};

export const withdrawSBTC = async (amount: number) => {
  const network = getNetwork();
  
  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw',
    functionArgs: [uintCV(amount)],
    onFinish: (data) => {
      console.log('Withdrawal sent:', data.txId);
    },
  });
};
