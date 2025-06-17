export const WALLET_CONFIG = {
  rpcUrl: 'https://horizon-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
} as const;

export type WalletConfig = typeof WALLET_CONFIG;

export interface WalletState {
  isConnected: boolean;
  walletType: 'freighter' | 'albedo' | null;
  publicKey: string | null;
  error: Error | null;
}

export interface WalletActions {
  connect: (type: 'freighter' | 'albedo', wallet: any) => Promise<void>;
  disconnect: () => Promise<void>;
} 