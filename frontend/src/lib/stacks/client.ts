import { STACKS_MOCKNET, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const getNetwork = () => {
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
  switch (network) {
    case 'mainnet':
      return STACKS_MAINNET;
    case 'testnet':
      return STACKS_TESTNET;
    default:
      return STACKS_MOCKNET;
  }
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST2QTHF5ANDT876XA3T0V032S1QWE9AGCN76PFFWM';
export const CONTRACT_NAME = 'savings';
export const SBTC_CONTRACT = process.env.NEXT_PUBLIC_SBTC_CONTRACT || 'ST2QTHF5ANDT876XA3T0V032S1QWE9AGCN76PFFWM.sbtc-token';
