import { CoinInfo, PoolData } from "../../types";
import { SuiClient } from "@mysten/sui/client";
type FetchPoolDataArgs = {
    poolId: string;
    client: SuiClient;
    reserveParentId: string;
    poolInfo: any;
};
type CoinPrice = {
    coinType: string;
    value: number;
    decimals: string;
    updateUnixTime: number;
    v24hChangePercent: number;
    updateHumanTime: string;
    priceChangePercent: number;
};
export declare const fetchPoolData: ({ poolId, client, reserveParentId, poolInfo }: FetchPoolDataArgs) => Promise<{
    coin_type: any;
    total_supply: number;
    total_borrow: number;
    tokenPrice: any;
    base_supply_rate: any;
    base_borrow_rate: any;
    boosted_supply_rate: any;
    boosted_borrow_rate: any;
    supply_cap_ceiling: number;
    borrow_cap_ceiling: number;
    current_supply_utilization: number;
    current_borrow_utilization: number;
    optimal_borrow_utilization: string;
    pool: any;
    max_ltv: string;
    liquidation_threshold: string;
    symbol: any;
    rewardTokenAddress: any;
}>;
export declare const fetchFlashloanData: (client: SuiClient) => Promise<{
    [key: string]: any;
}>;
/**
 * Retrieves pool information for a given coin symbol.
 * @param coinSymbol - The symbol of the coin.
 * @returns The pool information for the specified coin symbol, or all pool information if no coin symbol is provided.
 * @throws If there is an error fetching the pool information.
 */
export declare function getPoolInfo(coin?: CoinInfo, client?: SuiClient): Promise<{
    [key: string]: any;
} | {
    coin_type: any;
    total_supply: number;
    total_borrow: number;
    tokenPrice: any;
    base_supply_rate: any;
    base_borrow_rate: any;
    boosted_supply_rate: any;
    boosted_borrow_rate: any;
    supply_cap_ceiling: number;
    borrow_cap_ceiling: number;
    current_supply_utilization: number;
    current_borrow_utilization: number;
    optimal_borrow_utilization: string;
    pool: any;
    max_ltv: string;
    liquidation_threshold: string;
    symbol: any;
    rewardTokenAddress: any;
}>;
/**
 * Retrieves the latest protocol package ID from the Navi Protocol API.
 * @returns The latest protocol package ID.
 */
export declare function getLatestProtocolPackageId(): Promise<any>;
export declare function getUserRewardHistory(userAddress: string, page?: number, size?: number): Promise<any>;
export declare function getPoolsInfo(): Promise<PoolData[] | null>;
export declare function fetchCoinPrices(coinTypes: string[], isInternal?: boolean, Token?: string, maxRetries?: number, delayTime?: number): Promise<CoinPrice[] | null>;
export {};
