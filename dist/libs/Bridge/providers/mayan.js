"use strict";
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
exports.swap = swap;
const swap_sdk_1 = require("@mayanfinance/swap-sdk");
const ethers_1 = require("ethers");
const ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
];
var BridgeChain;
(function (BridgeChain) {
    BridgeChain[BridgeChain["SUI"] = 1999] = "SUI";
    BridgeChain[BridgeChain["SOLANA"] = 0] = "SOLANA";
})(BridgeChain || (BridgeChain = {}));
function swap(route, fromAddress, toAddress, walletConnection, referrerAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!route) {
            throw new Error("No route found");
        }
        const mayanQuote = route.info_for_bridge;
        let hash;
        if (route.from_token.chainId === BridgeChain.SUI) {
            if (!walletConnection.sui) {
                throw new Error("Sui wallet connection not found");
            }
            const client = walletConnection.sui.provider;
            const swapTrx = yield (0, swap_sdk_1.createSwapFromSuiMoveCalls)(mayanQuote, fromAddress, toAddress, referrerAddresses, null, client);
            const connection = walletConnection.sui;
            const signed = yield connection.signTransaction({ transaction: swapTrx });
            const resp = yield client.executeTransactionBlock({
                transactionBlock: signed.bytes,
                signature: [signed.signature],
                options: {
                    showEffects: true,
                    showEvents: true,
                    showBalanceChanges: true,
                },
            });
            hash = resp.digest;
            yield client.waitForTransaction({
                digest: hash,
            });
        }
        else if (route.from_token.chainId === BridgeChain.SOLANA) {
            if (!walletConnection.solana) {
                throw new Error("Solana wallet connection not found");
            }
            const connection = walletConnection.solana;
            const swapTrx = yield (0, swap_sdk_1.swapFromSolana)(mayanQuote, fromAddress, toAddress, referrerAddresses, connection.signTransaction, connection.connection, connection.extraRpcs, connection.sendOptions, connection.jitoOptions);
            hash = swapTrx.signature;
        }
        else {
            if (!walletConnection.evm) {
                throw new Error("EVM wallet connection not found");
            }
            const connection = walletConnection.evm;
            const fromToken = mayanQuote.fromToken;
            if (fromToken.standard === "erc20") {
                const erc20Contract = new ethers_1.Contract(fromToken.realOriginContractAddress || fromToken.contract, ERC20_ABI, connection.signer);
                const currentAllowance = yield erc20Contract.allowance(fromAddress, swap_sdk_1.addresses.MAYAN_FORWARDER_CONTRACT);
                const REQUIRED_ALLOWANCE = (0, ethers_1.parseUnits)(String(mayanQuote.effectiveAmountIn), fromToken.decimals);
                if (currentAllowance < REQUIRED_ALLOWANCE) {
                    const approveTrx = yield erc20Contract.approve(swap_sdk_1.addresses.MAYAN_FORWARDER_CONTRACT, REQUIRED_ALLOWANCE);
                    const receiptApprove = yield approveTrx.wait();
                    if (!receiptApprove) {
                        throw new Error("Failed to approve allowance");
                    }
                }
            }
            const swapTrx = yield (0, swap_sdk_1.swapFromEvm)(mayanQuote, fromAddress, toAddress, referrerAddresses, connection.signer, connection.permit, connection.overrides, null);
            hash = typeof swapTrx === "string" ? swapTrx : swapTrx.hash;
            yield connection.waitForTransaction({
                hash,
                confirmations: 3,
            });
        }
        // wait for 2 seconds to make sure the mayan has processed the transaction
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
        return hash;
    });
}
