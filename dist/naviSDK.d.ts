import { AccountManager } from "./libs/AccountManager";
import { initializeParams, CoinInfo, SwapOptions, Quote } from "./types";
export declare class NAVISDKClient {
    account: AccountManager;
    accounts: AccountManager[];
    mnemonic: string;
    networkType: string;
    /**
     * Constructs a new instance of the NAVISDKClient.
     *
     * @param {Object} params - The initialization parameters.
     * @param {string} [params.mnemonic=""] - The mnemonic for account generation. If not provided, a new one will be generated.
     * @param {string} params.networkType - The network type to connect to. Defaults to "mainnet" if not specified.
     * @param {number} [params.wordLength=12] - The word length for the mnemonic. Can be 12 or 24.
     * @param {number} [params.numberOfAccounts=10] - The number of accounts to generate.
     * @param {string[]} [params.privateKeyList=[""]] - A list of private keys for account initialization.
     */
    constructor({ mnemonic, networkType, wordLength, numberOfAccounts, privateKeyList }?: initializeParams);
    /**
     * Retrieves all accounts stored in the Navi SDK.
     * @returns An array of all accounts.
     */
    getAllAccounts(): AccountManager[];
    /**
     * Retrieves the mnemonic associated with the Navi SDK instance.
     * @returns The mnemonic string.
     */
    getMnemonic(): string;
    /**
     * Retrieves the pool information for a specific coin symbol.
     * If no coin symbol is provided, it retrieves the pool information for all coins.
     * @param coinType - The data type of the coin for which to retrieve the pool information.
     * @returns A Promise that resolves to the pool information.
     */
    getPoolInfo(coinType?: CoinInfo): Promise<{
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
     * Retrieves the reserve detail for a given asset ID.
     * @param coinType - The CoinInfo data type for which to retrieve the reserve detail.
     * @returns A Promise that resolves when the reserve detail is retrieved.
     */
    getReserveDetail(coinType: CoinInfo): Promise<import("@mysten/sui/dist/cjs/client").SuiObjectResponse>;
    /**
     * Retrieves the health factor for a given address.
     * @param address - The address for which to retrieve the health factor.
     * @returns A promise that resolves to the health factor value.
     */
    getHealthFactor(address: string): Promise<number>;
    /**
     * Retrieves the dynamic health factor for a given address and pool.
     * @param address - The address to retrieve the dynamic health factor for.
     * @param coinType - The type of the pool.
     * @param estimateSupply - The estimated supply value.
     * @param estimateBorrow - The estimated borrow value.
     * @param isIncrease - A boolean indicating whether the estimated supply or borrow is increasing (default: true).
     * @returns A Promise that resolves to the dynamic health factor.
     */
    getDynamicHealthFactor(address: string, coinType: CoinInfo, estimateSupply: number, estimateBorrow: number, isIncrease?: boolean): Promise<string>;
    /**
     * Retrieves all NAVI portfolios for the accounts.
     * @returns A promise that resolves to an array of results for each account.
     */
    getAllNaviPortfolios(): Promise<Map<string, {
        borrowBalance: number;
        supplyBalance: number;
    }>>;
    /**
     * Retrieves the balances of all accounts.
     * @returns A record containing the balances of each coin.
     */
    getAllBalances(): Promise<Record<string, number>>;
    /**
     * Checks the available rewards for a given address.
     * @param address - The address to check rewards for.
     * @param option - The option type for rewards.
     * @returns A promise that resolves with the available rewards.
     */
    getAddressAvailableRewards(address?: string, option?: number[]): Promise<{
        assetId: number;
        rewardType: number;
        rewards: {
            coinType: string;
            available: string;
        }[];
    }[]>;
    /**
     * Retrieves the claimed rewards history for a given user address.
     * @param userAddress - The address of the user to retrieve the rewards history for. Defaults to the first account's address.
     * @param page - The page number to retrieve. Defaults to 1.
     * @param size - The number of records per page. Defaults to 400.
     * @returns A promise that resolves with the user's claimed rewards history.
     */
    getClaimedRewardsHistory(userAddress?: string, page?: number, size?: number): Promise<any>;
    /**
     * Retrieves a quote for swapping one coin to another.
     * @param fromCoinAddress - The address of the coin to swap from.
     * @param toCoinAddress - The address of the coin to swap to.
     * @param amountIn - The amount of the fromCoin to swap. Can be a number, string, or bigint.
     * @param apiKey - The API key for authentication.
     * @param swapOptions - Optional. The options for the swap, including baseUrl, dexList, byAmountIn, and depth.
     * @returns A promise that resolves with the quote for the swap.
     */
    getQuote(fromCoinAddress: string, toCoinAddress: string, amountIn: number | string | bigint, apiKey?: string, swapOptions?: SwapOptions): Promise<Quote>;
}
