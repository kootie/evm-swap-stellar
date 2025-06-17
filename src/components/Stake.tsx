import { useState, useEffect } from 'react';

interface StakeInfo {
  asset: string;
  amount: number;
  value: number;
}

interface StakeProps {
  stakes: StakeInfo[];
  onWithdraw: (asset: string, amount: number) => Promise<void>;
}

export default function Stake({ stakes, onWithdraw }: StakeProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleWithdraw = async (asset: string, amount: number) => {
    setIsLoading(prev => ({ ...prev, [asset]: true }));
    try {
      await onWithdraw(asset, amount);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [asset]: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Staked Assets
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Automatically staked from your swaps
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {stakes.map((stake) => (
              <div
                key={stake.asset}
                className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt className="text-sm font-medium text-gray-500">
                  {stake.asset}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                  {stake.amount.toFixed(8)}
                </dd>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                  <button
                    onClick={() => handleWithdraw(stake.asset, stake.amount)}
                    disabled={isLoading[stake.asset]}
                    className="btn-secondary text-sm"
                  >
                    {isLoading[stake.asset] ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                </dd>
              </div>
            ))}
            {stakes.length === 0 && (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No staked assets yet. Start swapping to earn stakes!
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
} 