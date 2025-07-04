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
exports.config = void 0;
exports.getSupportChains = getSupportChains;
exports.getSupportTokens = getSupportTokens;
exports.searchSupportTokens = searchSupportTokens;
exports.getQuote = getQuote;
exports.getTransaction = getTransaction;
exports.getWalletTransactions = getWalletTransactions;
exports.swap = swap;
const mayan = __importStar(require("./providers/mayan"));
const config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
function getSupportChains() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield config_1.apiInstance.get("/chains/list");
        return res.data.data.chains;
    });
}
function getSupportTokens(chainId_1) {
    return __awaiter(this, arguments, void 0, function* (chainId, page = 1, pageSize = 100) {
        const res = yield config_1.apiInstance.get("/coins/support-token-list", {
            params: {
                chain: chainId,
                page,
                pageSize,
                scene: "bridge",
            },
        });
        return res.data.data.list;
    });
}
function searchSupportTokens(chainId, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield config_1.apiInstance.get("/coins/search", {
            params: {
                chain: chainId,
                keyword,
                page: 1,
                pageSize: 30,
                scene: "bridge",
            },
        });
        return res.data.data.list;
    });
}
function getQuote(from, to, amount, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield config_1.apiInstance.get("/bridge-swap/find_routes", {
            params: {
                from: from.address,
                to: to.address,
                fromChain: from.chainId,
                toChain: to.chainId,
                amount,
                slippageBps: options === null || options === void 0 ? void 0 : options.slippageBps,
                referrerBps: options === null || options === void 0 ? void 0 : options.referrerBps,
            },
        });
        return res.data.data;
    });
}
function getTransaction(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield config_1.apiInstance.get(`/bridge-swap/transaction/${hash}`);
        return res.data.data.transaction;
    });
}
function getWalletTransactions(address_1) {
    return __awaiter(this, arguments, void 0, function* (address, page = 1, limit = 10) {
        const res = yield config_1.apiInstance.get(`/bridge-swap/transactions/list`, {
            params: {
                address,
                page,
                limit,
            },
        });
        return res.data.data;
    });
}
function swap(quote, fromAddress, toAddress, walletConnection, referrerAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        const startAt = new Date().toISOString();
        const hash = yield mayan.swap(quote, fromAddress, toAddress, walletConnection, referrerAddresses);
        const endAt = new Date().toISOString();
        const sourceToken = {
            address: quote.from_token.address,
            symbol: quote.from_token.symbol,
            decimals: quote.from_token.decimals,
        };
        const destToken = {
            address: quote.to_token.address,
            symbol: quote.to_token.symbol,
            decimals: quote.to_token.decimals,
        };
        return {
            id: hash,
            status: "processing",
            lastUpdateAt: endAt,
            sourceChainId: quote.from_token.chainId,
            destChainId: quote.to_token.chainId,
            walletSourceAddress: fromAddress,
            walletDestAddress: toAddress,
            totalFeeAmount: quote.total_fee,
            sourceToken: quote.from_token,
            destToken: quote.to_token,
            bridgeFromAmount: quote.amount_in,
            bridgeToAmount: quote.amount_out,
            bridgeStartAt: startAt,
            bridgeEndAt: endAt,
            bridgeFeeAmount: "0",
            bridgeSourceTxHash: hash,
            bridgeDestTxHash: "",
            bridgeRefundTxHash: "",
            bridgeStatus: "processing",
            bridgeProvider: "mayan",
            bridgeFromToken: sourceToken,
            bridgeToToken: destToken,
            hasSwap: false,
        };
    });
}
