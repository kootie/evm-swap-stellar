import { useCallback } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

interface WalletInitializer {
  initializeFreighter: () => Promise<void>;
  initializeAlbedo: () => Promise<void>;
}

export function useWalletInitializer(): WalletInitializer {
  const { connect } = useWalletContext();

  const initializeFreighter = useCallback(async () => {
    try {
      // TODO: Initialize Freighter wallet when SDK is available
      const mockWallet = {
        connect: async () => {},
        disconnect: async () => {},
        getPublicKey: async () => 'mock-freighter-key',
        signTransaction: async (tx: any) => tx,
      };
      await connect('freighter', mockWallet);
    } catch (error) {
      console.error('Failed to initialize Freighter wallet:', error);
      throw error;
    }
  }, [connect]);

  const initializeAlbedo = useCallback(async () => {
    try {
      // TODO: Initialize Albedo wallet when SDK is available
      const mockWallet = {
        connect: async () => {},
        disconnect: async () => {},
        getPublicKey: async () => 'mock-albedo-key',
        signTransaction: async (tx: any) => tx,
      };
      await connect('albedo', mockWallet);
    } catch (error) {
      console.error('Failed to initialize Albedo wallet:', error);
      throw error;
    }
  }, [connect]);

  return {
    initializeFreighter,
    initializeAlbedo,
  };
} 