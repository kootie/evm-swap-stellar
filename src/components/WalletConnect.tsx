import React, { useEffect, useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { useWalletInitializer } from '../hooks/useWalletInitializer';
import { detectWallets, WALLET_INFO, WalletType } from '../utils/walletDetection';

export const WalletConnect: React.FC = () => {
  const { isConnected, walletType, publicKey, disconnect, error } = useWalletContext();
  const { initializeFreighter, initializeAlbedo } = useWalletInitializer();
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);

  useEffect(() => {
    const wallets = detectWallets();
    setAvailableWallets(wallets.map(w => w.type));
  }, []);

  const handleConnect = async (type: WalletType) => {
    if (type === 'freighter') {
      await initializeFreighter();
    } else if (type === 'albedo') {
      await initializeAlbedo();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isConnected ? (
        <div className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 text-center">
            Available Wallets
          </div>
          <div className="flex space-x-4">
            {availableWallets.map(type => (
              <button
                key={type}
                onClick={() => handleConnect(type)}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  type === 'freighter' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {WALLET_INFO[type].name}
              </button>
            ))}
          </div>
          {availableWallets.length === 0 && (
            <div className="text-sm text-gray-500 text-center">
              No wallets detected. Please install Freighter or use Albedo.
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm text-gray-600">
            Connected with {WALLET_INFO[walletType!].name}
          </div>
          <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
            {publicKey}
          </div>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
}; 