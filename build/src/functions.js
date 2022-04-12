"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardFunctions = void 0;
const bignumber_js_1 = require("bignumber.js");
const funcs = [
    {
        name: 'sqrt',
        callback: (args) => {
            if (args.length !== 1 || args[0].isNaN())
                return new bignumber_js_1.default(NaN);
            const n = Math.sqrt(args[0].toNumber());
            return new bignumber_js_1.default(n);
        },
        docs: 'takes the square root of the number',
    },
    {
        name: 'ln',
        callback: (args) => {
            if (args.length !== 1 || args[0].isNaN())
                return new bignumber_js_1.default(NaN);
            const n = Math.log(args[0].toNumber());
            return new bignumber_js_1.default(n);
        },
        docs: 'takes the natural log of the number',
    },
    {
        name: 'log',
        callback: (args) => {
            var _a, _b, _c;
            if (args.length === 0 || args.length > 2 || args[0].isNaN() || (args[1] && ((_a = args[1]) === null || _a === void 0 ? void 0 : _a.isNaN())))
                return new bignumber_js_1.default(NaN);
            const a = Math.log(args[0].toNumber());
            const b = Math.log((_c = (_b = args[1]) === null || _b === void 0 ? void 0 : _b.toNumber()) !== null && _c !== void 0 ? _c : 10);
            return new bignumber_js_1.default(a).div(new bignumber_js_1.default(b));
        },
        docs: 'log(a, b?) takes the log base b of a with b = 10 as default',
    },
    {
        name: 'sum',
        callback: (args) => {
            return args.reduce((a, b) => a.plus(b));
        },
        docs: 'sum(...) sums the arguments to the function. If any of the arguments are null, sum will return null',
    },
    {
        name: 'max',
        callback: (args) => {
            if (args.some(v => v.isNaN()))
                return new bignumber_js_1.default(NaN);
            return args.reduce((a, b) => a.comparedTo(b) < 0 ? b : a);
        },
        docs: 'max(...) returns the maximum of the arguments. If any of the arguments are null, max will return null',
    },
    {
        name: 'min',
        callback: (args) => {
            if (args.some(v => v.isNaN()))
                return new bignumber_js_1.default(NaN);
            return args.reduce((a, b) => a.comparedTo(b) < 0 ? a : b);
        },
        docs: 'min(...) returns the minimum of the arguments. If any of the arguments are null, min will return null',
    },
    {
        name: 'mean',
        callback: (args) => {
            return args.reduce((a, b) => a.plus(b)).div(args.length);
        },
        docs: 'mean(...) returns the average/mean of the arguments. If any of the arguments are null, mean will return null',
    },
];
exports.StandardFunctions = new Map(funcs.map(func => [func.name, func]));
//# sourceMappingURL=functions.js.map