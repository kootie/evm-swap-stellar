export type WalletType = 'freighter' | 'albedo';

interface WalletInfo {
  type: WalletType;
  isAvailable: boolean;
  name: string;
  description: string;
}

export const WALLET_INFO: Record<WalletType, WalletInfo> = {
  freighter: {
    type: 'freighter',
    isAvailable: false,
    name: 'Freighter',
    description: 'A browser extension wallet for Stellar',
  },
  albedo: {
    type: 'albedo',
    isAvailable: false,
    name: 'Albedo',
    description: 'A web-based wallet for Stellar',
  },
};

export function detectWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];

  // Check for Freighter
  if (typeof window !== 'undefined' && (window as any).freighter) {
    wallets.push({
      ...WALLET_INFO.freighter,
      isAvailable: true,
    });
  }

  // Check for Albedo
  if (typeof window !== 'undefined' && (window as any).albedo) {
    wallets.push({
      ...WALLET_INFO.albedo,
      isAvailable: true,
    });
  }

  return wallets;
}

export function getAvailableWallets(): WalletType[] {
  return detectWallets()
    .filter(wallet => wallet.isAvailable)
    .map(wallet => wallet.type);
}

export function isWalletAvailable(type: WalletType): boolean {
  return detectWallets().some(wallet => wallet.type === type && wallet.isAvailable);
} 