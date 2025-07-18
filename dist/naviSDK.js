"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAVISDKClient = void 0;
const AccountManager_1 = require("./libs/AccountManager");
const PoolInfo_1 = require("./libs/PoolInfo");
const bip39 = __importStar(require("@scure/bip39"));
const english_1 = require("@scure/bip39/wordlists/english");
const address_1 = require("./address");
const PTB_1 = require("./libs/PTB");
const getQuote_1 = require("./libs/Aggregator/getQuote");
class NAVISDKClient {
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
    constructor({ mnemonic = "", networkType, wordLength = 12, numberOfAccounts = 10, privateKeyList = [""] } = {}) {
        this.accounts = [];
        this.mnemonic = "";
        this.networkType = "";
        this.networkType = networkType || "mainnet";
        if (privateKeyList && privateKeyList.length > 0 && privateKeyList[0] !== "") {
            // Initialize accounts using provided private keys
            this.accounts = privateKeyList.map(privateKey => new AccountManager_1.AccountManager({ privateKey: privateKey, network: this.networkType }));
        }
        else {
            // Generate a new mnemonic if not provided
            this.mnemonic = mnemonic !== "" ? mnemonic : bip39.generateMnemonic(english_1.wordlist, wordLength === 12 ? 128 : 256);
            // Generate accounts using the mnemonic
            for (let i = 0; i < numberOfAccounts; i++) {
                this.account = new AccountManager_1.AccountManager({ mnemonic: this.mnemonic, network: this.networkType, accountIndex: i });
                this.accounts.push(this.account);
            }
        }
        console.log("Network Type:", this.networkType);
    }
    /**
     * Retrieves all accounts stored in the Navi SDK.
     * @returns An array of all accounts.
     */
    getAllAccounts() {
        this.accounts.forEach((account, index) => {
            console.log(`index: ${index}, address: ${account.getPublicKey()}`);
        });
        return this.accounts;
    }
    /**
     * Retrieves the mnemonic associated with the Navi SDK instance.
     * @returns The mnemonic string.
     */
    getMnemonic() {
        console.log(`mnemonic: ${this.mnemonic}`);
        return this.mnemonic;
    }
    /**
     * Retrieves the pool information for a specific coin symbol.
     * If no coin symbol is provided, it retrieves the pool information for all coins.
     * @param coinType - The data type of the coin for which to retrieve the pool information.
     * @returns A Promise that resolves to the pool information.
     */
    getPoolInfo(coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, PoolInfo_1.getPoolInfo)(coinType, this.accounts[0].client);
        });
    }
    /**
     * Retrieves the reserve detail for a given asset ID.
     * @param coinType - The CoinInfo data type for which to retrieve the reserve detail.
     * @returns A Promise that resolves when the reserve detail is retrieved.
     */
    getReserveDetail(coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const reserve = address_1.pool[coinType.symbol];
            return this.accounts[0].getReservesDetail(reserve.assetId);
        });
    }
    /**
     * Retrieves the health factor for a given address.
     * @param address - The address for which to retrieve the health factor.
     * @returns A promise that resolves to the health factor value.
     */
    getHealthFactor(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accounts.length === 0) {
                this.account = new AccountManager_1.AccountManager();
                this.accounts.push(this.account);
                yield this.accounts[0].getHealthFactor(address);
                this.accounts.splice(0, 1);
            }
            return this.accounts[0].getHealthFactor(address);
        });
    }
    /**
     * Retrieves the dynamic health factor for a given address and pool.
     * @param address - The address to retrieve the dynamic health factor for.
     * @param coinType - The type of the pool.
     * @param estimateSupply - The estimated supply value.
     * @param estimateBorrow - The estimated borrow value.
     * @param isIncrease - A boolean indicating whether the estimated supply or borrow is increasing (default: true).
     * @returns A Promise that resolves to the dynamic health factor.
     */
    getDynamicHealthFactor(address_2, coinType_1, estimateSupply_1, estimateBorrow_1) {
        return __awaiter(this, arguments, void 0, function* (address, coinType, estimateSupply, estimateBorrow, isIncrease = true) {
            if (this.accounts.length === 0) {
                this.account = new AccountManager_1.AccountManager();
                this.accounts.push(this.account);
                yield this.accounts[0].getDynamicHealthFactor(address, coinType, estimateSupply, estimateBorrow, isIncrease);
                this.accounts.splice(0, 1);
            }
            return this.accounts[0].getDynamicHealthFactor(address, coinType, estimateSupply, estimateBorrow, isIncrease);
        });
    }
    /**
     * Retrieves all NAVI portfolios for the accounts.
     * @returns A promise that resolves to an array of results for each account.
     */
    getAllNaviPortfolios() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(this.accounts.map(account => account.getNAVIPortfolio(account.address, false)));
            const balanceMap = new Map();
            results.forEach(result => {
                result.forEach((value, key) => {
                    const balance = balanceMap.get(key) || { borrowBalance: 0, supplyBalance: 0 };
                    balance.borrowBalance += value.borrowBalance;
                    balance.supplyBalance += value.supplyBalance;
                    balanceMap.set(key, balance);
                });
            });
            return balanceMap;
        });
    }
    /**
     * Retrieves the balances of all accounts.
     * @returns A record containing the balances of each coin.
     */
    getAllBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            const balancePromises = this.accounts.map(account => account.getWalletBalance(false));
            const balancesAll = yield Promise.all(balancePromises);
            const coinBalances = {};
            balancesAll.forEach(balance => {
                Object.entries(balance).forEach(([coin, amount]) => {
                    coinBalances[coin] = (coinBalances[coin] || 0) + amount;
                });
            });
            return coinBalances;
        });
    }
    /**
     * Checks the available rewards for a given address.
     * @param address - The address to check rewards for.
     * @param option - The option type for rewards.
     * @returns A promise that resolves with the available rewards.
     */
    getAddressAvailableRewards() {
        return __awaiter(this, arguments, void 0, function* (address = this.accounts[0].address, option = [1,]) {
            const client = this.accounts[0].client;
            return (0, PTB_1.getAvailableRewards)(client, address, option, true);
        });
    }
    /**
     * Retrieves the claimed rewards history for a given user address.
     * @param userAddress - The address of the user to retrieve the rewards history for. Defaults to the first account's address.
     * @param page - The page number to retrieve. Defaults to 1.
     * @param size - The number of records per page. Defaults to 400.
     * @returns A promise that resolves with the user's claimed rewards history.
     */
    getClaimedRewardsHistory() {
        return __awaiter(this, arguments, void 0, function* (userAddress = this.accounts[0].address, page = 1, size = 400) {
            return (0, PoolInfo_1.getUserRewardHistory)(userAddress, page, size);
        });
    }
    /**
     * Retrieves a quote for swapping one coin to another.
     * @param fromCoinAddress - The address of the coin to swap from.
     * @param toCoinAddress - The address of the coin to swap to.
     * @param amountIn - The amount of the fromCoin to swap. Can be a number, string, or bigint.
     * @param apiKey - The API key for authentication.
     * @param swapOptions - Optional. The options for the swap, including baseUrl, dexList, byAmountIn, and depth.
     * @returns A promise that resolves with the quote for the swap.
     */
    getQuote(fromCoinAddress_1, toCoinAddress_1, amountIn_1, apiKey_1) {
        return __awaiter(this, arguments, void 0, function* (fromCoinAddress, toCoinAddress, amountIn, apiKey, swapOptions = { baseUrl: undefined, dexList: [], byAmountIn: true, depth: 3 }) {
            return (0, getQuote_1.getQuote)(fromCoinAddress, toCoinAddress, amountIn, apiKey, swapOptions);
        });
    }
}
exports.NAVISDKClient = NAVISDKClient;
