import React, { useEffect, useState } from 'react';
import { BlendService } from '../services/blendService';
import { blendConfig } from '../config/blend';
import { BackstopPoolEst, BackstopPoolUserEst } from '@blend-capital/blend-sdk';
import { useWalletStore } from '../services/walletService';
import toast from 'react-hot-toast';

interface BackstopTokenInfo {
    total: number;
    q4wPercentage: number;
}

interface PoolBalanceInfo {
    total: number;
}

interface UserTokensInfo {
    total: number;
    queued: number;
    unclaimed: number;
}

interface BackstopPoolEstimate {
    backstopToken: BackstopTokenInfo;
    poolBalance: PoolBalanceInfo;
}

interface BackstopPoolUserEstimate {
    userTokens: UserTokensInfo;
}

export const Loan: React.FC = () => {
    const [blendService] = useState(() => new BlendService(blendConfig));
    const [backstopInfo, setBackstopInfo] = useState<BackstopPoolEstimate | null>(null);
    const [userBackstopPosition, setUserBackstopPosition] = useState<BackstopPoolUserEstimate | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { address } = useWalletStore();

    useEffect(() => {
        loadBackstopInfo();
    }, []);

    useEffect(() => {
        if (address) {
            loadUserBackstopPosition();
        }
    }, [address]);

    const loadBackstopInfo = async () => {
        try {
            setIsLoading(true);
            const info = await blendService.getBackstopInfo();
            setBackstopInfo(info as unknown as BackstopPoolEstimate);
        } catch (error) {
            console.error('Error loading backstop info:', error);
            toast.error('Failed to load backstop information');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserBackstopPosition = async () => {
        if (!address) return;
        
        try {
            setIsLoading(true);
            const position = await blendService.getUserBackstopPosition(address);
            setUserBackstopPosition(position as unknown as BackstopPoolUserEstimate);
        } catch (error) {
            console.error('Error loading user backstop position:', error);
            toast.error('Failed to load user backstop position');
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
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Backstop Information</h2>
                {backstopInfo ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Total Backstop Size</p>
                            <p className="font-medium">{backstopInfo.backstopToken.total} XLM</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Q4W Percentage</p>
                            <p className="font-medium">{backstopInfo.backstopToken.q4wPercentage}%</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Pool Balance</p>
                            <p className="font-medium">{backstopInfo.poolBalance.total} XLM</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No backstop data available</p>
                )}
            </div>

            {address && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Your Backstop Position</h2>
                    {userBackstopPosition ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Total Tokens</p>
                                    <p className="font-medium">{userBackstopPosition.userTokens.total} BLND</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Queued Withdrawals</p>
                                    <p className="font-medium">{userBackstopPosition.userTokens.queued} BLND</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Unclaimed Emissions</p>
                                    <p className="font-medium">{userBackstopPosition.userTokens.unclaimed} BLND</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No backstop position found</p>
                    )}
                </div>
            )}
        </div>
    );
}; 