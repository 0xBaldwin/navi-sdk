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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolsApy = exports.getCurrentRules = exports.getBorrowFee = exports.getPoolApy = exports.migrateModule = exports.claimRewardsByAssetIdPTB = exports.claimAllRewardsResupplyPTB = exports.updateOraclePTB = exports.registerStructs = exports.claimAllRewardsPTB = exports.getAvailableRewards = exports.liquidateFunction = exports.SignAndSubmitTXB = exports.repayFlashLoan = exports.flashloan = exports.returnMergedCoins = exports.repayDebt = exports.borrowCoin = exports.getHealthFactorPTB = exports.withdrawCoinWithAccountCap = exports.withdrawCoin = exports.unstakeTovSui = exports.stakeTovSuiPTB = exports.depositCoinWithAccountCap = exports.depositCoin = void 0;
var commonFunctions_1 = require("./commonFunctions");
Object.defineProperty(exports, "depositCoin", { enumerable: true, get: function () { return commonFunctions_1.depositCoin; } });
Object.defineProperty(exports, "depositCoinWithAccountCap", { enumerable: true, get: function () { return commonFunctions_1.depositCoinWithAccountCap; } });
Object.defineProperty(exports, "stakeTovSuiPTB", { enumerable: true, get: function () { return commonFunctions_1.stakeTovSuiPTB; } });
Object.defineProperty(exports, "unstakeTovSui", { enumerable: true, get: function () { return commonFunctions_1.unstakeTovSui; } });
Object.defineProperty(exports, "withdrawCoin", { enumerable: true, get: function () { return commonFunctions_1.withdrawCoin; } });
Object.defineProperty(exports, "withdrawCoinWithAccountCap", { enumerable: true, get: function () { return commonFunctions_1.withdrawCoinWithAccountCap; } });
Object.defineProperty(exports, "getHealthFactorPTB", { enumerable: true, get: function () { return commonFunctions_1.getHealthFactorPTB; } });
Object.defineProperty(exports, "borrowCoin", { enumerable: true, get: function () { return commonFunctions_1.borrowCoin; } });
Object.defineProperty(exports, "repayDebt", { enumerable: true, get: function () { return commonFunctions_1.repayDebt; } });
Object.defineProperty(exports, "returnMergedCoins", { enumerable: true, get: function () { return commonFunctions_1.returnMergedCoins; } });
Object.defineProperty(exports, "flashloan", { enumerable: true, get: function () { return commonFunctions_1.flashloan; } });
Object.defineProperty(exports, "repayFlashLoan", { enumerable: true, get: function () { return commonFunctions_1.repayFlashLoan; } });
Object.defineProperty(exports, "SignAndSubmitTXB", { enumerable: true, get: function () { return commonFunctions_1.SignAndSubmitTXB; } });
Object.defineProperty(exports, "liquidateFunction", { enumerable: true, get: function () { return commonFunctions_1.liquidateFunction; } });
Object.defineProperty(exports, "getAvailableRewards", { enumerable: true, get: function () { return commonFunctions_1.getAvailableRewards; } });
Object.defineProperty(exports, "claimAllRewardsPTB", { enumerable: true, get: function () { return commonFunctions_1.claimAllRewardsPTB; } });
Object.defineProperty(exports, "registerStructs", { enumerable: true, get: function () { return commonFunctions_1.registerStructs; } });
Object.defineProperty(exports, "updateOraclePTB", { enumerable: true, get: function () { return commonFunctions_1.updateOraclePTB; } });
Object.defineProperty(exports, "claimAllRewardsResupplyPTB", { enumerable: true, get: function () { return commonFunctions_1.claimAllRewardsResupplyPTB; } });
Object.defineProperty(exports, "claimRewardsByAssetIdPTB", { enumerable: true, get: function () { return commonFunctions_1.claimRewardsByAssetIdPTB; } });
__exportStar(require("../Aggregator"), exports);
exports.migrateModule = __importStar(require("./migrate"));
var V3_1 = require("./V3");
Object.defineProperty(exports, "getPoolApy", { enumerable: true, get: function () { return V3_1.getPoolApy; } });
Object.defineProperty(exports, "getBorrowFee", { enumerable: true, get: function () { return V3_1.getBorrowFee; } });
Object.defineProperty(exports, "getCurrentRules", { enumerable: true, get: function () { return V3_1.getCurrentRules; } });
Object.defineProperty(exports, "getPoolsApy", { enumerable: true, get: function () { return V3_1.getPoolsApy; } });
