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
exports.getCoins = getCoins;
exports.getCoinPTB = getCoinPTB;
exports.buildSwapPTBFromQuote = buildSwapPTBFromQuote;
exports.swapPTB = swapPTB;
exports.checkIfNAVIIntegrated = checkIfNAVIIntegrated;
const config_1 = require("./config");
const types_1 = require("../../types");
const commonFunctions_1 = require("../PTB/commonFunctions");
const cetus_1 = require("./Dex/cetus");
const turbos_1 = require("./Dex/turbos");
const kriyaV3_1 = require("./Dex/kriyaV3");
const aftermath_1 = require("./Dex/aftermath");
const KriyaV2_1 = require("./Dex/KriyaV2");
const deepbook_1 = require("./Dex/deepbook");
const getQuote_1 = require("./getQuote");
const address_1 = require("../../address");
const utils_1 = require("./utils");
const bluefin_1 = require("./Dex/bluefin");
const vSui_1 = require("./Dex/vSui");
const haSui_1 = require("./Dex/haSui");
function getCoins(client_1, address_2) {
    return __awaiter(this, arguments, void 0, function* (client, address, coinType = "0x2::sui::SUI") {
        const coinAddress = coinType.address ? coinType.address : coinType;
        const coinDetails = yield client.getCoins({
            owner: address,
            coinType: coinAddress,
        });
        return coinDetails;
    });
}
function getCoinPTB(address, coin, amountIn, txb, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let coinA;
        if (coin === "0x2::sui::SUI") {
            coinA = txb.splitCoins(txb.gas, [txb.pure.u64(amountIn)]);
        }
        else {
            const coinInfo = yield getCoins(client, address, coin);
            // Check if user has enough balance for tokenA
            if (!coinInfo.data[0]) {
                throw new Error("Insufficient balance for this coin");
            }
            // Merge coins if necessary, to cover the amount needed
            const mergedCoin = (0, commonFunctions_1.returnMergedCoins)(txb, coinInfo);
            coinA = txb.splitCoins(mergedCoin, [txb.pure.u64(amountIn)]);
        }
        return coinA;
    });
}
function buildSwapPTBFromQuote(userAddress_1, txb_1, minAmountOut_1, coinIn_1, quote_1) {
    return __awaiter(this, arguments, void 0, function* (userAddress, txb, minAmountOut, coinIn, quote, referral = 0, ifPrint = true // Set ifPrint to be optional with a default value
    ) {
        if (!quote.routes || quote.routes.length === 0) {
            throw new Error("No routes found in data");
        }
        const tokenA = quote.from;
        const tokenB = quote.target;
        const allPaths = JSON.parse(JSON.stringify(quote.routes));
        if (ifPrint) {
            console.log(`tokenA: ${tokenA}, tokenB: ${tokenB}`);
        }
        if (Number(quote.amount_in) !==
            quote.routes.reduce((sum, route) => sum + Number(route.amount_in), 0)) {
            throw new Error("Outer amount_in does not match the sum of route amount_in values");
        }
        const finalCoinB = txb.moveCall({
            target: "0x2::coin::zero",
            typeArguments: [tokenB],
        });
        for (let i = 0; i < allPaths.length; i++) {
            const path = allPaths[i];
            const pathCoinAmountIn = Math.floor(path.amount_in);
            const pathCoinAmountOut = path.amount_out;
            if (ifPrint) {
                console.log(`Path Index: `, i, `Amount In: `, pathCoinAmountIn, `Expected Amount Out: `, pathCoinAmountOut);
            }
            let pathTempCoin = txb.splitCoins(coinIn, [pathCoinAmountIn]);
            for (let j = 0; j < path.path.length; j++) {
                const route = path.path[j];
                const poolId = route.id;
                const provider = route.provider;
                const tempTokenA = route.from;
                const tempTokenB = route.target;
                const a2b = route.a2b;
                const typeArguments = route.info_for_ptb.typeArguments;
                let amountInPTB;
                let tuborsVersion;
                if (provider === "turbos") {
                    tuborsVersion = route.info_for_ptb.contractVersionId;
                }
                if (ifPrint) {
                    console.log(`Route Index: `, i, "-", j, `provider: `, provider, `from: `, tempTokenA, `to: `, tempTokenB);
                }
                amountInPTB = txb.moveCall({
                    target: "0x2::coin::value",
                    arguments: [pathTempCoin],
                    typeArguments: [tempTokenA],
                });
                switch (provider) {
                    case types_1.Dex.CETUS: {
                        let toSwapBalance = txb.moveCall({
                            target: "0x2::coin::into_balance",
                            arguments: [pathTempCoin],
                            typeArguments: [tempTokenA],
                        });
                        const { receiveCoin, leftCoin } = yield (0, cetus_1.makeCETUSPTB)(txb, poolId, true, toSwapBalance, amountInPTB, a2b, typeArguments);
                        txb.transferObjects([leftCoin], userAddress);
                        pathTempCoin = receiveCoin;
                        break;
                    }
                    case types_1.Dex.TURBOS: {
                        pathTempCoin = txb.makeMoveVec({
                            elements: [pathTempCoin],
                        });
                        const { turbosCoinB, turbosCoinA } = yield (0, turbos_1.makeTurbosPTB)(txb, poolId, true, pathTempCoin, amountInPTB, a2b, typeArguments, userAddress, tuborsVersion);
                        txb.transferObjects([turbosCoinA], userAddress);
                        pathTempCoin = turbosCoinB;
                        break;
                    }
                    case types_1.Dex.KRIYA_V2: {
                        pathTempCoin = yield (0, KriyaV2_1.makeKriyaV2PTB)(txb, poolId, true, pathTempCoin, amountInPTB, a2b, typeArguments);
                        break;
                    }
                    case types_1.Dex.KRIYA_V3: {
                        pathTempCoin = yield (0, kriyaV3_1.makeKriyaV3PTB)(txb, poolId, true, pathTempCoin, amountInPTB, a2b, typeArguments);
                        break;
                    }
                    case types_1.Dex.AFTERMATH: {
                        const amountLimit = route.info_for_ptb.amountLimit;
                        pathTempCoin = yield (0, aftermath_1.makeAftermathPTB)(txb, poolId, pathTempCoin, amountLimit, a2b, typeArguments);
                        break;
                    }
                    case types_1.Dex.DEEPBOOK: {
                        const amountLimit = route.info_for_ptb.amountLimit;
                        const { baseCoinOut, quoteCoinOut } = yield (0, deepbook_1.makeDeepbookPTB)(txb, poolId, pathTempCoin, amountLimit, a2b, typeArguments);
                        if (a2b) {
                            pathTempCoin = quoteCoinOut;
                            txb.transferObjects([baseCoinOut], userAddress);
                        }
                        else {
                            pathTempCoin = baseCoinOut;
                            txb.transferObjects([quoteCoinOut], userAddress);
                        }
                        break;
                    }
                    case types_1.Dex.BLUEFIN: {
                        const { coinAOut, coinBOut } = yield (0, bluefin_1.makeBluefinPTB)(txb, poolId, pathTempCoin, amountInPTB, a2b, typeArguments);
                        if (a2b) {
                            txb.transferObjects([coinAOut], userAddress);
                            pathTempCoin = coinBOut;
                        }
                        else {
                            txb.transferObjects([coinBOut], userAddress);
                            pathTempCoin = coinAOut;
                        }
                        break;
                    }
                    case types_1.Dex.VSUI: {
                        pathTempCoin = yield (0, vSui_1.makeVSUIPTB)(txb, pathTempCoin, a2b);
                        break;
                    }
                    case types_1.Dex.HASUI: {
                        pathTempCoin = yield (0, haSui_1.makeHASUIPTB)(txb, pathTempCoin, a2b);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
            txb.mergeCoins(finalCoinB, [pathTempCoin]);
        }
        txb.transferObjects([coinIn], userAddress);
        txb.moveCall({
            target: `${config_1.AggregatorConfig.aggregatorContract}::slippage::check_slippage_v2`,
            arguments: [
                finalCoinB, // output coin object
                txb.pure.u64(Math.floor(minAmountOut)), // min amount out
                txb.pure.u64(quote.amount_in), // amount in
                txb.pure.u64(referral), // refferal id
            ],
            typeArguments: [tokenA, tokenB],
        });
        return finalCoinB;
    });
}
function swapPTB(address_2, txb_1, fromCoinAddress_1, toCoinAddress_1, coin_1, amountIn_1, minAmountOut_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (address, txb, fromCoinAddress, toCoinAddress, coin, amountIn, minAmountOut, apiKey, swapOptions = {
        baseUrl: undefined,
        dexList: [],
        byAmountIn: true,
        depth: 3,
        feeOption: { fee: 0, receiverAddress: "0x0" },
        ifPrint: true,
    }) {
        let finalCoinB;
        const refId = apiKey ? (0, utils_1.generateRefId)(apiKey) : 0;
        if (swapOptions.feeOption &&
            swapOptions.feeOption.fee > 0 &&
            swapOptions.feeOption.receiverAddress !== "0x0") {
            const feeAmount = Math.floor(Number(swapOptions.feeOption.fee) * Number(amountIn));
            const leftAmount = Number(amountIn) - Number(feeAmount);
            const feeCoin = txb.splitCoins(coin, [feeAmount]);
            if (fromCoinAddress === address_1.vSui.address) {
                txb.transferObjects([feeCoin], swapOptions.feeOption.receiverAddress);
                const quote = yield (0, getQuote_1.getQuote)(fromCoinAddress, toCoinAddress, leftAmount, apiKey, swapOptions);
                const newMinAmountOut = Math.max(0, Math.floor(minAmountOut * (1 - swapOptions.feeOption.fee)));
                finalCoinB = yield buildSwapPTBFromQuote(address, txb, newMinAmountOut, coin, quote, refId, swapOptions.ifPrint);
            }
            else {
                const [feeQuote, quote] = yield Promise.all([
                    (0, getQuote_1.getQuote)(fromCoinAddress, address_1.vSui.address, feeAmount, apiKey, swapOptions),
                    (0, getQuote_1.getQuote)(fromCoinAddress, toCoinAddress, leftAmount, apiKey, swapOptions),
                ]);
                const newMinAmountOut = Math.max(0, Math.floor(minAmountOut - Number(feeQuote.amount_out)));
                const [feeCoinB, finalCoinBResult] = yield Promise.all([
                    buildSwapPTBFromQuote(address, txb, 0, feeCoin, feeQuote, refId, swapOptions.ifPrint),
                    buildSwapPTBFromQuote(address, txb, newMinAmountOut, coin, quote, refId, swapOptions.ifPrint),
                ]);
                txb.transferObjects([feeCoinB], swapOptions.feeOption.receiverAddress);
                finalCoinB = finalCoinBResult;
            }
        }
        else {
            // Get the output coin from the swap route and transfer it to the user
            const quote = yield (0, getQuote_1.getQuote)(fromCoinAddress, toCoinAddress, amountIn, apiKey, swapOptions);
            finalCoinB = yield buildSwapPTBFromQuote(address, txb, minAmountOut, coin, quote, refId, swapOptions.ifPrint);
        }
        return finalCoinB;
    });
}
function checkIfNAVIIntegrated(digest, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const results = yield client.getTransactionBlock({ digest, options: { showEvents: true } });
        return (_b = (_a = results.events) === null || _a === void 0 ? void 0 : _a.some(event => event.type.includes(`${config_1.AggregatorConfig.aggregatorContract}::slippage`))) !== null && _b !== void 0 ? _b : false;
    });
}
