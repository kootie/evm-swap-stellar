import React, { useEffect, useState } from 'react';
import { BlendService } from '../services/blendService';
import { blendConfig } from '../config/blend';
import { PoolEstimate, PositionsEstimate } from '@blend-capital/blend-sdk';
import { useWalletStore } from '../services/walletService';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { ArrowTrendingUpIcon, ShieldCheckIcon, BellAlertIcon } from '@heroicons/react/24/outline';

interface PoolData {
  id: string;
  name: string;
  apy: number;
  risk: number;
  utilization: number;
  totalValue: number;
}

interface Position {
  id: string;
  poolId: string;
  asset: string;
  amount: number;
  apy: number;
  risk: number;
}

interface PositionMakerProps {
  onConnectWallet: () => Promise<void>;
  onCreatePosition: (poolId: string, amount: number) => Promise<void>;
  onMovePosition: (positionId: string, newPoolId: string) => Promise<void>;
  isWalletConnected: boolean;
}

interface PoolEstimateData {
    tvl: number;
    totalBorrowed: number;
    utilization: number;
    apr: number;
}

interface PositionsEstimateData {
    totalSupplied: number;
    totalBorrowed: number;
    borrowLimit: number;
    netApr: number;
}

export const PositionMaker: React.FC<PositionMakerProps> = ({
  onConnectWallet,
  onCreatePosition,
  onMovePosition,
  isWalletConnected,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [pools, setPools] = useState<PoolData[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);
  const [blendService] = useState(() => new BlendService(blendConfig));
  const [poolEstimate, setPoolEstimate] = useState<PoolEstimateData | null>(null);
  const [userPositions, setUserPositions] = useState<PositionsEstimateData | null>(null);
  const { address } = useWalletStore();

  useEffect(() => {
    loadPoolData();
  }, []);

  useEffect(() => {
    if (address) {
      loadUserPositions();
    }
  }, [address]);

  const loadPoolData = async () => {
    try {
      setIsLoading(true);
      const poolData = await blendService.getPools();
      setPoolEstimate(poolData as unknown as PoolEstimateData);
    } catch (error) {
      console.error('Error loading pool data:', error);
      toast.error('Failed to load pool data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPositions = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      const positions = await blendService.getUserPositions(address);
      setUserPositions(positions as unknown as PositionsEstimateData);
    } catch (error) {
      console.error('Error loading user positions:', error);
      toast.error('Failed to load user positions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePosition = async () => {
    if (!selectedPool || !amount || isNaN(Number(amount))) return;
    
    setIsLoading(true);
    try {
      await onCreatePosition(selectedPool, Number(amount));
      setAmount('');
      setSelectedPool('');
    } catch (error) {
      console.error('Failed to create position:', error);
      setAlerts(prev => [...prev, { type: 'error', message: 'Failed to create position' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Position Maker</h1>
        <p className="mt-2 text-gray-600">Create and manage your Blend positions</p>
      </div>

      {/* Wallet Connection */}
      {!isWalletConnected && (
        <div className="text-center mb-8">
          <button
            onClick={onConnectWallet}
            className="btn-primary"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Main Content */}
      {isWalletConnected && (
        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span>Create Position</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5" />
                <span>My Positions</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <BellAlertIcon className="h-5 w-5" />
                <span>Alerts</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Create Position Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Pool
                  </label>
                  <select
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stellar-blue focus:border-stellar-blue sm:text-sm rounded-md"
                  >
                    <option value="">Select a pool</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name} - APY: {pool.apy}% - Risk: {pool.risk}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-stellar-blue focus:border-stellar-blue sm:text-sm"
                    placeholder="0.0"
                  />
                </div>

                <button
                  onClick={handleCreatePosition}
                  disabled={isLoading || !selectedPool || !amount}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Creating...' : 'Create Position'}
                </button>
              </div>
            </Tab.Panel>

            {/* My Positions Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {position.asset}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Amount: {position.amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        APY: {position.apy}%
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onMovePosition(position.id, '')}
                        className="btn-secondary"
                      >
                        Move
                      </button>
                    </div>
                  </div>
                ))}
                {positions.length === 0 && (
                  <p className="text-center text-gray-500">
                    No positions yet. Create your first position!
                  </p>
                )}
              </div>
            </Tab.Panel>

            {/* Alerts Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      alert.type === 'error'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
                {alerts.length === 0 && (
                  <p className="text-center text-gray-500">
                    No alerts at the moment
                  </p>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}

      {address && (
        <div className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Pool Information</h2>
            {poolEstimate ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Total Value Locked</p>
                  <p className="font-medium">{poolEstimate.tvl} XLM</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Borrowed</p>
                  <p className="font-medium">{poolEstimate.totalBorrowed} XLM</p>
                </div>
                <div>
                  <p className="text-gray-600">Utilization Rate</p>
                  <p className="font-medium">{poolEstimate.utilization}%</p>
                </div>
                <div>
                  <p className="text-gray-600">APR</p>
                  <p className="font-medium">{poolEstimate.apr}%</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No pool data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Your Positions</h2>
            {userPositions ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Total Supplied</p>
                    <p className="font-medium">{userPositions.totalSupplied} XLM</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Borrowed</p>
                    <p className="font-medium">{userPositions.totalBorrowed} XLM</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Borrow Limit</p>
                    <p className="font-medium">{userPositions.borrowLimit} XLM</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Net APR</p>
                    <p className="font-medium">{userPositions.netApr}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No positions found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 