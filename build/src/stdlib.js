"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardConstants = exports.StandardFunctions = void 0;
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
            const n = Math.round(Math.log(args[0].toNumber()) * 10) / 10;
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
        name: 'pow',
        callback: (args) => {
            if (args.length !== 2 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const [base, exp] = args;
            try {
                return base.pow(exp);
            }
            catch (e) {
                const n = Math.pow(base.toNumber(), exp.toNumber());
                return new bignumber_js_1.default(n);
            }
        },
        docs: 'pow(a, b) raises a to the b power',
    },
    {
        name: 'sin',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const deg = args[0].dividedBy(new bignumber_js_1.default(180)).multipliedBy(new bignumber_js_1.default(Math.PI));
            const n = Math.sin(deg.toNumber());
            return new bignumber_js_1.default(n);
        },
        docs: 'sin(deg) returns the sine of a number in degrees',
    },
    {
        name: 'cos',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const deg = args[0].dividedBy(new bignumber_js_1.default(180)).multipliedBy(new bignumber_js_1.default(Math.PI));
            const n = Math.cos(deg.toNumber());
            return new bignumber_js_1.default(n);
        },
        docs: 'cos(deg) returns the cosine of a number in degrees',
    },
    {
        name: 'tan',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const deg = args[0].dividedBy(new bignumber_js_1.default(180)).multipliedBy(new bignumber_js_1.default(Math.PI));
            const n = Math.tan(deg.toNumber());
            return new bignumber_js_1.default(n);
        },
        docs: 'tan(deg) returns the tangent of a number in degrees',
    },
    {
        name: 'arcsin',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const rad = Math.asin(args[0].toNumber());
            const deg = new bignumber_js_1.default(rad).multipliedBy(new bignumber_js_1.default(180)).dividedBy(new bignumber_js_1.default(Math.PI));
            return deg;
        },
        docs: 'arcsin(x) returns the inverse sine of x in degrees',
    },
    {
        name: 'arccos',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const rad = Math.acos(args[0].toNumber());
            const deg = new bignumber_js_1.default(rad).multipliedBy(new bignumber_js_1.default(180)).dividedBy(new bignumber_js_1.default(Math.PI));
            return deg;
        },
        docs: 'arccos(x) returns the inverse cosine of x in degrees',
    },
    {
        name: 'arctan',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            const rad = Math.atan(args[0].toNumber());
            const deg = new bignumber_js_1.default(rad).multipliedBy(new bignumber_js_1.default(180)).dividedBy(new bignumber_js_1.default(Math.PI));
            return deg;
        },
        docs: 'arctan(x) returns the inverse tangent of x in degrees',
    },
    {
        name: 'abs',
        callback: (args) => {
            if (args.length !== 1 || args.some(x => x.isNaN()))
                return new bignumber_js_1.default(NaN);
            return args[0].abs();
        },
        docs: 'abs(n) returns the absolute value of n',
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
const consts = [
    {
        name: 'e',
        value: new bignumber_js_1.default(Math.E),
        docs: 'Euler\'s number',
    },
    {
        name: 'pi',
        value: new bignumber_js_1.default(Math.PI),
        docs: 'pi',
    },
    {
        name: 'π',
        value: new bignumber_js_1.default(Math.PI),
        docs: 'pi',
    },
];
exports.StandardFunctions = new Map(funcs.map(f => [f.name, f]));
exports.StandardConstants = new Map(consts.map(c => [c.name, c]));
//# sourceMappingURL=stdlib.js.map