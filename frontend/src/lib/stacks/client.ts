import { STACKS_MOCKNET, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// Lazy-load AppConfig/UserSession to avoid SSR issues
let _userSession: any = null;

export const getUserSession = async () => {
  if (_userSession) return _userSession;
  const { AppConfig, UserSession } = await import('@stacks/connect');
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  _userSession = new UserSession({ appConfig });
  return _userSession;
};

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
