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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = getQuote;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
/**
 * Get a swap quote between two coins using the aggregator API.
 *
 * @param fromCoinAddress - The address of the coin to swap from.
 * @param toCoinAddress - The address of the coin to swap to.
 * @param amountIn - The amount of the fromCoin to swap. Can be a number, string, or bigint.
 * @param apiKey - Optional API key for authentication.
 * @param swapOptions - Optional swap options including baseUrl, dexList, byAmountIn, and depth.
 * @returns A promise that resolves to a Router object containing the swap route details.
 * @throws Will throw an error if the API request fails or returns no data.
 */
function getQuote(fromCoinAddress_1, toCoinAddress_1, amountIn_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (fromCoinAddress, toCoinAddress, amountIn, apiKey, swapOptions = { baseUrl: undefined, dexList: [], byAmountIn: true, depth: 3 }) {
        let baseUrl = config_1.AggregatorConfig.aggregatorBaseUrl;
        if (swapOptions.baseUrl) {
            baseUrl = swapOptions.baseUrl;
        }
        // Construct query parameters for the API request
        const params = new URLSearchParams({
            from: fromCoinAddress,
            target: toCoinAddress,
            amount: (typeof amountIn === 'bigint' ? Number(amountIn) : amountIn).toString(),
            by_amount_in: (swapOptions === null || swapOptions === void 0 ? void 0 : swapOptions.byAmountIn) !== undefined ? swapOptions.byAmountIn.toString() : 'true',
            depth: (swapOptions === null || swapOptions === void 0 ? void 0 : swapOptions.depth) !== undefined ? swapOptions.depth.toString() : '3',
            version: '1'
        }).toString();
        // Construct dex provider string if dexList is provided
        let dexString = '';
        if ((swapOptions === null || swapOptions === void 0 ? void 0 : swapOptions.dexList) && swapOptions.dexList.length > 0) {
            dexString = swapOptions.dexList.map(dex => `providers=${dex}`).join('&');
        }
        // Combine parameters and dexString for the full API request
        const fullParams = dexString ? `${params}&${dexString}` : params;
        try {
            // Make the API request to fetch the swap route
            const axiosConfig = apiKey ? { headers: { 'x-navi-token': apiKey } } : {};
            const { data } = yield axios_1.default.get(`${baseUrl}?${fullParams}`, axiosConfig);
            if (!data) {
                throw new Error('No data returned from the API.');
            }
            // Set the from and target properties in the returned data
            data.data.from = fromCoinAddress;
            data.data.target = toCoinAddress;
            return data.data;
        }
        catch (error) {
            console.error(`Error fetching routes from ${config_1.AggregatorConfig.aggregatorBaseUrl} with params ${JSON.stringify(params)}:`, error.message);
            throw error;
        }
    });
}
