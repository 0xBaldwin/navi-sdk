import { Transaction } from "@mysten/sui/transactions";
import { CoinInfo, MigrateOptions } from "../../types";
/**
 * Retrieves the flashloan fee for a specified coin.
 *
 * @param coin - The target coin information.
 * @returns The flashloan fee rate (e.g., 0.003 represents 0.3%).
 */
export declare function getFlashloanFee(coin: CoinInfo): Promise<number>;
/**
 * Migrates supply from one coin to another using a flashloan.
 *
 * @param txb - The transaction builder.
 * @param fromCoin - The supply coin to migrate from.
 * @param toCoin - The supply coin to migrate to.
 * @param amount - The from coin amount min unit to migrate.
 * @param address - The user's address.
 * @param migrateOptions - Optional migration parameters.
 * @returns The updated transaction builder.
 */
export declare function migrateSupplyPTB(txb: Transaction, fromCoin: CoinInfo, toCoin: CoinInfo, amount: number, address: string, migrateOptions?: MigrateOptions): Promise<Transaction>;
/**
 * Migrates borrowing from one coin to another using a flashloan.
 *
 * @param txb - The transaction builder.
 * @param fromCoin - The borrow coin to migrate from.
 * @param toCoin - The borrow coin to migrate to.
 * @param amount - The from coin amount in min unit to migrate.
 * @param address - The user's address.
 * @param migrateOptions - Optional migration parameters.
 * @returns The updated transaction builder.
 */
export declare function migrateBorrowPTB(txb: Transaction, fromCoin: CoinInfo, toCoin: CoinInfo, amount: number, address: string, migrateOptions?: MigrateOptions): Promise<Transaction>;
/**
 * Migrates both supply and borrow positions using flashloans.
 *
 * @param txb - The transaction builder.
 * @param supplyFromCoin - The coin to supply from.
 * @param supplyToCoin - The coin to supply to.
 * @param borrowFromCoin - The coin to borrow from.
 * @param borrowToCoin - The coin to borrow to.
 * @param supplyAmount - The amount to supply.
 * @param borrowAmount - The amount to borrow.
 * @param address - The user's address.
 * @param migrateOptions - Optional migration parameters.
 * @returns The updated transaction builder.
 */
export declare function migratePTB(txb: Transaction, supplyFromCoin: CoinInfo, supplyToCoin: CoinInfo, borrowFromCoin: CoinInfo, borrowToCoin: CoinInfo, supplyAmount: number, borrowAmount: number, address: string, migrateOptions?: MigrateOptions): Promise<Transaction>;
/**
 * Retrieves the list of coins that can be migrated.
 *
 * @returns An array of migratable coins.
 */
export declare function getMigratableCoins(): CoinInfo[];
