import { Quote, SwapOptions } from '../../types';
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/dist/cjs/client";
export declare function getCoins(client: SuiClient, address: string, coinType?: any): Promise<import("@mysten/sui/dist/cjs/client").PaginatedCoins>;
export declare function getCoinPTB(address: string, coin: string, amountIn: number | string | bigint, txb: Transaction, client: SuiClient): Promise<TransactionResult>;
export declare function buildSwapPTBFromQuote(userAddress: string, txb: Transaction, minAmountOut: number, coinIn: TransactionResult, quote: Quote, referral?: number, ifPrint?: boolean): Promise<TransactionResult>;
export declare function swapPTB(address: string, txb: Transaction, fromCoinAddress: string, toCoinAddress: string, coin: TransactionResult, amountIn: number | string | bigint, minAmountOut: number, apiKey?: string, swapOptions?: SwapOptions): Promise<TransactionResult>;
export declare function checkIfNAVIIntegrated(digest: string, client: SuiClient): Promise<boolean>;
