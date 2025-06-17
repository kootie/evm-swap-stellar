import React, { createContext, useContext } from 'react';
import { useWallet } from '../hooks/useWallet';
import { WalletState, WalletActions } from '../config/wallet';

interface WalletContextType extends WalletState, WalletActions {}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}; 