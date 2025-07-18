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
exports.moveInspect = moveInspect;
exports.getReservesDetail = getReservesDetail;
exports.getAddressPortfolio = getAddressPortfolio;
exports.getHealthFactorCall = getHealthFactorCall;
exports.getReserveData = getReserveData;
exports.getIncentiveAPY = getIncentiveAPY;
exports.getCoinOracleInfo = getCoinOracleInfo;
const transactions_1 = require("@mysten/sui/transactions");
const bcs_1 = require("@mysten/sui.js/bcs");
const address_1 = require("../../address");
const PTB_1 = require("../PTB");
/**
 * Parses and prints the inspection results.
 * @param data - The inspection results to be parsed and printed.
 * @param funName - The name of the function being inspected.
 * @param parseType - The type of parsing to be applied (optional).
 * @returns An array of parsed values.
 */
function inspectResultParseAndPrint(data, funName, parseType) {
    if (data.results && data.results.length > 0) {
        if (data.results[0].returnValues && data.results[0].returnValues.length > 0) {
            let values = [];
            for (let v of data.results[0].returnValues) {
                let _type = parseType ? parseType : v[1];
                if (_type == 'vector<0x1::ascii::String>') {
                    _type = 'vector<string>';
                }
                let result = bcs_1.bcs.de(_type, Uint8Array.from(v[0]));
                values.push(result);
            }
            return values;
        }
    }
    else if (data.error) {
        console.log(`Get an error, msg: ${data.error}`);
    }
    return [];
}
/**
 * Executes the specified function on the provided transaction block and prints the inspection result.
 * @param txb - The transaction block to execute the function on.
 * @param client - The SuiClient instance.
 * @param sender - The sender of the transaction block.
 * @param funName - The name of the function to execute.
 * @param typeName - Optional. The type name associated with the function.
 * @returns A promise that resolves to the inspection result.
 */
function moveInspectImpl(txb, client, sender, funName, typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield client.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: sender,
        });
        return inspectResultParseAndPrint(result, funName, typeName);
    });
}
/**
 * Moves and inspects a function call.
 * @param client - The SuiClient object.
 * @param sender - The sender of the function call.
 * @param target - The target of the function call in the format `${string}::${string}::${string}`.
 * @param args - The arguments for the function call.
 * @param typeArgs - Optional type arguments for the function call.
 * @param typeName - Optional type name for the function call.
 * @returns A Promise that resolves to the result of the move and inspect operation.
 */
function moveInspect(tx, client, sender, target, args, typeArgs, typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        const funcName = target.split('::');
        tx.moveCall({
            target: target,
            arguments: args,
            typeArguments: typeArgs,
        });
        return yield moveInspectImpl(tx, client, sender, funcName.slice(1, 3).join('::'), typeName);
    });
}
/**
 * Retrieves the detailed information of a reserve based on the provided asset ID.
 * @param assetId - The ID of the asset for which to retrieve the reserve details.
 * @returns A Promise that resolves to the parsed result of the reserve details.
 */
function getReservesDetail(assetId, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield (0, address_1.getConfig)();
        const result = yield client.getDynamicFieldObject({ parentId: config.ReserveParentId, name: { type: 'u8', value: assetId } });
        return result;
    });
}
function getAddressPortfolio(address_2) {
    return __awaiter(this, arguments, void 0, function* (address, prettyPrint = true, client, decimals) {
        const balanceMap = new Map();
        yield Promise.all(Object.keys(address_1.pool).map((poolKey) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            const reserve = address_1.pool[poolKey];
            const borrowBalance = yield client.getDynamicFieldObject({ parentId: reserve.borrowBalanceParentId, name: { type: 'address', value: address } });
            const supplyBalance = yield client.getDynamicFieldObject({ parentId: reserve.supplyBalanceParentId, name: { type: 'address', value: address } });
            const borrowIndexData = yield getReservesDetail(reserve.assetId, client);
            const borrowIndex = ((_e = (_d = (_c = (_b = (_a = borrowIndexData.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.current_borrow_index) / Math.pow(10, 27);
            const supplyIndex = ((_k = (_j = (_h = (_g = (_f = borrowIndexData.data) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.fields) === null || _k === void 0 ? void 0 : _k.current_supply_index) / Math.pow(10, 27);
            let borrowValue = 0;
            let supplyValue = 0;
            borrowValue = borrowBalance && ((_m = (_l = borrowBalance.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.fields.value) !== undefined ? ((_p = (_o = borrowBalance.data) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.fields.value) / Math.pow(10, 9) : 0;
            supplyValue = supplyBalance && ((_r = (_q = supplyBalance.data) === null || _q === void 0 ? void 0 : _q.content) === null || _r === void 0 ? void 0 : _r.fields.value) !== undefined ? ((_t = (_s = supplyBalance.data) === null || _s === void 0 ? void 0 : _s.content) === null || _t === void 0 ? void 0 : _t.fields.value) / Math.pow(10, 9) : 0;
            borrowValue *= borrowIndex;
            supplyValue *= supplyIndex;
            if (!decimals) {
                borrowValue = borrowBalance && ((_v = (_u = borrowBalance.data) === null || _u === void 0 ? void 0 : _u.content) === null || _v === void 0 ? void 0 : _v.fields.value) !== undefined ? (_x = (_w = borrowBalance.data) === null || _w === void 0 ? void 0 : _w.content) === null || _x === void 0 ? void 0 : _x.fields.value : 0;
                supplyValue = supplyBalance && ((_z = (_y = supplyBalance.data) === null || _y === void 0 ? void 0 : _y.content) === null || _z === void 0 ? void 0 : _z.fields.value) !== undefined ? (_1 = (_0 = supplyBalance.data) === null || _0 === void 0 ? void 0 : _0.content) === null || _1 === void 0 ? void 0 : _1.fields.value : 0;
                borrowValue *= borrowIndex;
                supplyValue *= supplyIndex;
            }
            if (prettyPrint) {
                console.log(`| ${poolKey} | ${borrowValue} | ${supplyValue} |`);
            }
            balanceMap.set(poolKey, { borrowBalance: borrowValue, supplyBalance: supplyValue });
        })));
        return balanceMap;
    });
}
function getHealthFactorCall(address, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield (0, address_1.getConfig)();
        const tx = new transactions_1.Transaction();
        const result = yield moveInspect(tx, client, address, `${config.ProtocolPackage}::logic::user_health_factor`, [
            tx.object('0x06'), // clock object id
            tx.object(config.StorageId), // object id of storage
            tx.object(config.PriceOracle), // object id of price oracle
            tx.pure.address(address), // user address
        ]);
        return result;
    });
}
function getReserveData(address, client) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, PTB_1.registerStructs)();
        const config = yield (0, address_1.getConfig)();
        const tx = new transactions_1.Transaction();
        const result = yield moveInspect(tx, client, address, `${config.uiGetter}::getter::get_reserve_data`, [
            tx.object(config.StorageId)
        ], [], 'vector<ReserveDataInfo>');
        return result[0];
    });
}
function getIncentiveAPY(address, client, option) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, PTB_1.registerStructs)();
        const config = yield (0, address_1.getConfig)();
        const tx = new transactions_1.Transaction();
        const result = yield moveInspect(tx, client, address, `${config.uiGetter}::incentive_getter::get_incentive_apy`, [
            tx.object('0x06'), // clock object id
            tx.object(config.IncentiveV2), // the incentive object v2
            tx.object(config.StorageId), // object id of storage
            tx.object(config.PriceOracle), // The price oracle object
            tx.pure.u8(option),
        ], [], // type arguments is null
        'vector<IncentiveAPYInfo>' // parse type
        );
        return result[0];
    });
}
function getCoinOracleInfo(client, oracleIds) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, PTB_1.registerStructs)();
        const config = yield (0, address_1.getConfig)();
        const tx = new transactions_1.Transaction();
        const result = yield moveInspect(tx, client, '0xcda879cde94eeeae2dd6df58c9ededc60bcf2f7aedb79777e47d95b2cfb016c2', `${config.uiGetter}::getter::get_oracle_info`, [
            tx.object('0x06'), // clock object id
            tx.object(config.PriceOracle), // The price oracle object
            tx.pure.vector("u8", oracleIds)
        ], [], // type arguments is null
        'vector<OracleInfo>' // parse type
        );
        return result[0];
    });
}
