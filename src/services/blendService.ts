import {
    Backstop,
    BackstopPool,
    BackstopPoolEst,
    BackstopPoolUser,
    BackstopPoolUserEst,
    Network,
    Pool,
    PoolEstimate,
    PoolOracle,
    PositionsEstimate,
} from '@blend-capital/blend-sdk';
import { ethers } from 'ethers';

export interface Pool {
    id: string;
    name: string;
    assets: string[];
    apy: number;
    tvl: number;
    riskLevel: string;
}

export interface Position {
    id: string;
    poolId: string;
    collateral: {
        asset: string;
        amount: number;
    };
    borrowed: {
        asset: string;
        amount: number;
    };
    healthFactor: number;
    apy: number;
}

export interface CreatePositionParams {
    poolId: string;
    collateral: {
        asset: string;
        amount: number;
    };
    borrowed: {
        asset: string;
        amount: number;
    };
}

export interface MovePositionParams {
    positionId: string;
    poolId: string;
    newCollateral: {
        asset: string;
        amount: number;
    };
    newBorrowed: {
        asset: string;
        amount: number;
    };
}

export interface BlendConfig {
    rpc: string;
    passphrase: string;
    backstopId: string;
    poolId: string;
}

export class BlendService {
    private network: Network;
    private backstopId: string;
    private poolId: string;

    constructor(config: BlendConfig) {
        this.network = {
            rpc: config.rpc,
            passphrase: config.passphrase,
            opts: { allowHttp: true }
        };
        this.backstopId = config.backstopId;
        this.poolId = config.poolId;
    }

    async getPools(): Promise<PoolEstimate> {
        try {
            const pool = await Pool.load(this.network, this.poolId);
            const poolOracle = await pool.loadOracle();
            return PoolEstimate.build(pool.reserves, poolOracle);
        } catch (error) {
            console.error('Error fetching pools:', error);
            throw error;
        }
    }

    async getUserPositions(userId: string): Promise<PositionsEstimate> {
        try {
            const pool = await Pool.load(this.network, this.poolId);
            const poolOracle = await pool.loadOracle();
            const poolUser = await pool.loadUser(userId);
            return PositionsEstimate.build(pool, poolOracle, poolUser.positions);
        } catch (error) {
            console.error('Error fetching user positions:', error);
            throw error;
        }
    }

    async getBackstopInfo(): Promise<BackstopPoolEst> {
        try {
            const backstop = await Backstop.load(this.network, this.backstopId);
            const backstopPool = await BackstopPool.load(this.network, this.backstopId, this.poolId);
            return BackstopPoolEst.build(backstop.backstopToken, backstopPool.poolBalance);
        } catch (error) {
            console.error('Error fetching backstop info:', error);
            throw error;
        }
    }

    async getUserBackstopPosition(userId: string): Promise<BackstopPoolUserEst> {
        try {
            const backstop = await Backstop.load(this.network, this.backstopId);
            const backstopPool = await BackstopPool.load(this.network, this.backstopId, this.poolId);
            const backstopPoolUser = await BackstopPoolUser.load(
                this.network,
                this.backstopId,
                this.poolId,
                userId
            );
            return BackstopPoolUserEst.build(backstop, backstopPool, backstopPoolUser);
        } catch (error) {
            console.error('Error fetching user backstop position:', error);
            throw error;
        }
    }

    async getPoolOracle(): Promise<PoolOracle> {
        try {
            const pool = await Pool.load(this.network, this.poolId);
            return await pool.loadOracle();
        } catch (error) {
            console.error('Error fetching pool oracle:', error);
            throw error;
        }
    }

    async createPosition(params: CreatePositionParams): Promise<Position> {
        try {
            const position = await this.blendSDK.createPosition({
                poolId: params.poolId,
                collateral: {
                    asset: params.collateral.asset,
                    amount: ethers.utils.parseUnits(params.collateral.amount.toString(), 18)
                },
                borrowed: {
                    asset: params.borrowed.asset,
                    amount: ethers.utils.parseUnits(params.borrowed.amount.toString(), 18)
                }
            });

            return {
                id: position.id,
                poolId: position.poolId,
                collateral: {
                    asset: position.collateral.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.collateral.amount, 18))
                },
                borrowed: {
                    asset: position.borrowed.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.borrowed.amount, 18))
                },
                healthFactor: position.healthFactor,
                apy: position.apy
            };
        } catch (error) {
            console.error('Error creating position:', error);
            throw error;
        }
    }

    async movePosition(params: MovePositionParams): Promise<Position> {
        try {
            const position = await this.blendSDK.movePosition({
                positionId: params.positionId,
                poolId: params.poolId,
                newCollateral: {
                    asset: params.newCollateral.asset,
                    amount: ethers.utils.parseUnits(params.newCollateral.amount.toString(), 18)
                },
                newBorrowed: {
                    asset: params.newBorrowed.asset,
                    amount: ethers.utils.parseUnits(params.newBorrowed.amount.toString(), 18)
                }
            });

            return {
                id: position.id,
                poolId: position.poolId,
                collateral: {
                    asset: position.collateral.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.collateral.amount, 18))
                },
                borrowed: {
                    asset: position.borrowed.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.borrowed.amount, 18))
                },
                healthFactor: position.healthFactor,
                apy: position.apy
            };
        } catch (error) {
            console.error('Error moving position:', error);
            throw error;
        }
    }

    async getPositions(userAddress: string): Promise<Position[]> {
        try {
            const positions = await this.blendSDK.getUserPositions(userAddress);
            return positions.map(position => ({
                id: position.id,
                poolId: position.poolId,
                collateral: {
                    asset: position.collateral.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.collateral.amount, 18))
                },
                borrowed: {
                    asset: position.borrowed.asset,
                    amount: parseFloat(ethers.utils.formatUnits(position.borrowed.amount, 18))
                },
                healthFactor: position.healthFactor,
                apy: position.apy
            }));
        } catch (error) {
            console.error('Error fetching user positions:', error);
            throw error;
        }
    }
} 