import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Asset = 'BTC' | 'ETH' | 'XLM';

interface SwapProps {
  onSwap: (fromAsset: Asset, toAsset: Asset, amount: number) => Promise<void>;
}

export default function Swap({ onSwap }: SwapProps) {
  const [fromAsset, setFromAsset] = useState<Asset>('ETH');
  const [toAsset, setToAsset] = useState<Asset>('BTC');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = async () => {
    if (!amount || isNaN(Number(amount))) return;
    
    setIsLoading(true);
    try {
      await onSwap(fromAsset, toAsset, Number(amount));
      setAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetSwitch = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field rounded-r-none"
              placeholder="0.0"
            />
            <select
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value as Asset)}
              className="rounded-l-none border-l-0 input-field w-24"
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="XLM">XLM</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAssetSwitch}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowPathIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              readOnly
              value={amount ? (Number(amount) * 0.9).toFixed(8) : ''}
              className="input-field rounded-r-none bg-gray-50"
              placeholder="0.0"
            />
            <select
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value as Asset)}
              className="rounded-l-none border-l-0 input-field w-24"
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="XLM">XLM</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p>10% will be automatically staked</p>
        </div>

        <button
          onClick={handleSwap}
          disabled={isLoading || !amount}
          className="btn-primary w-full"
        >
          {isLoading ? 'Swapping...' : 'Swap'}
        </button>
      </div>
    </div>
  );
} 