import { useState, useCallback, useEffect } from 'react';
import { WalletService } from '../services/walletService';
import { WALLET_CONFIG, WalletState, WalletActions } from '../config/wallet';

export function useWallet(): WalletState & WalletActions {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    walletType: null,
    publicKey: null,
    error: null,
  });

  const walletService = WalletService.getInstance(WALLET_CONFIG);

  const connect = useCallback(async (type: 'freighter' | 'albedo', wallet: any) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await walletService.connectWallet(type, wallet);
      const pk = await walletService.getPublicKey();
      setState({
        isConnected: true,
        walletType: type,
        publicKey: pk,
        error: null,
      });
    } catch (err) {
      setState({
        isConnected: false,
        walletType: null,
        publicKey: null,
        error: err instanceof Error ? err : new Error('Failed to connect wallet'),
      });
    }
  }, [walletService]);

  const disconnect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await walletService.disconnectWallet();
      setState({
        isConnected: false,
        walletType: null,
        publicKey: null,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error('Failed to disconnect wallet'),
      }));
    }
  }, [walletService]);

  useEffect(() => {
    // Check initial connection status
    const isConnected = walletService.isConnected();
    const walletType = walletService.getWalletType();
    
    setState(prev => ({
      ...prev,
      isConnected,
      walletType,
    }));

    // Get public key if connected
    if (isConnected) {
      walletService.getPublicKey()
        .then(pk => setState(prev => ({ ...prev, publicKey: pk })))
        .catch(err => setState(prev => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Failed to get public key'),
        })));
    }
  }, [walletService]);

  return {
    ...state,
    connect,
    disconnect,
  };
} 