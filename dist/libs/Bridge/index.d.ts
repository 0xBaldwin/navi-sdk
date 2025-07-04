import { Chain, Token, BridgeSwapOptions, BridgeSwapQuote, BridgeSwapTransaction } from "../../types";
import { WalletConnection } from "./providers/mayan";
import { config } from "./config";
export { config };
export declare function getSupportChains(): Promise<Chain[]>;
export declare function getSupportTokens(chainId: number, page?: number, pageSize?: number): Promise<Token[]>;
export declare function searchSupportTokens(chainId: number, keyword: string): Promise<Token[]>;
export declare function getQuote(from: Token, to: Token, amount: string | number, options?: BridgeSwapOptions): Promise<{
    routes: BridgeSwapQuote[];
}>;
export declare function getTransaction(hash: string): Promise<BridgeSwapTransaction>;
export declare function getWalletTransactions(address: string, page?: number, limit?: number): Promise<{
    transactions: BridgeSwapTransaction[];
}>;
export declare function swap(quote: BridgeSwapQuote, fromAddress: string, toAddress: string, walletConnection: WalletConnection, referrerAddresses?: {
    sui?: string;
    evm?: string;
    solana?: string;
}): Promise<BridgeSwapTransaction>;
