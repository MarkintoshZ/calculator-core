"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreter = exports.CalculatorInterpreter = void 0;
const bignumber_js_1 = require("bignumber.js");
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
const parser_1 = require("./parser");
const BaseCstVisitor = parser_1.parser.getBaseCstVisitorConstructor();
class CalculatorInterpreter extends BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    lines(ctx, stack = new Map()) {
        var _a;
        this.variables = stack;
        if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.children) === null || _a === void 0 ? void 0 : _a.line)
            return ctx.children.line.map((line) => {
                const { variable, value } = this.visit(line, this.variables);
                this.variables.set(variable, value);
                return { variable, value };
            });
    }
    line(ctx, stack = new Map()) {
        this.variables = stack;
        if (ctx.additionExpression) {
            return { variable: null, value: this.visit(ctx.additionExpression) };
        }
        else if (ctx.assignOperation) {
            return this.visit(ctx.assignOperation);
        }
        else {
            return { variable: null, value: new bignumber_js_1.default(NaN) };
        }
    }
    assignOperation(ctx) {
        const variable = ctx.Identifier[0].image;
        const value = this.visit(ctx.additionExpression);
        return { variable, value };
    }
    additionExpression(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                const rhsValue = this.visit(rhsOperand);
                const operator = ctx.AdditionOperator[idx];
                if ((0, chevrotain_1.tokenMatcher)(operator, tokens_1.Plus)) {
                    result = result.plus(rhsValue);
                }
                else {
                    result = result.minus(rhsValue);
                }
            });
        }
        return result;
    }
    multiplicationExpression(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                const rhsValue = this.visit(rhsOperand);
                const operator = ctx.MultiplicationOperator[idx];
                if ((0, chevrotain_1.tokenMatcher)(operator, tokens_1.Multi)) {
                    result = result.multipliedBy(rhsValue);
                }
                else {
                    result = result.dividedBy(rhsValue);
                }
            });
        }
        return result;
    }
    negationExpression(ctx) {
        const result = this.visit(ctx.value);
        return ctx.negation ? result.negated() : result;
    }
    negationAtomicExpression(ctx) {
        const result = this.visit(ctx.value);
        return ctx.negation ? result.negated() : result;
    }
    powerExpression(ctx) {
        let base = this.visit(ctx.base);
        if (ctx.exponent) {
            ctx.exponent.reverse().forEach((expNode) => {
                const exp = this.visit(expNode);
                try {
                    base = base.pow(exp);
                }
                catch (e) {
                    const n = Math.pow(base.toNumber(), exp.toNumber());
                    base = new bignumber_js_1.default(n);
                }
            });
        }
        return base;
    }
    atomicExpression(ctx) {
        var _a;
        if (ctx.parenthesisExpression) {
            return this.visit(ctx.parenthesisExpression);
        }
        else if (ctx.NumberLiteral) {
            return new bignumber_js_1.default(ctx.NumberLiteral[0].image);
        }
        else if (ctx.function) {
            return this.visit(ctx.function);
        }
        else if (ctx.Identifier) {
            const varName = ctx.Identifier[0].image;
            const value = (_a = this.variables.get(varName)) !== null && _a !== void 0 ? _a : this.consts.get(varName);
            if (!value)
                throw Error(`Use of undefined variable "${varName}"`);
            return value;
        }
    }
    parenthesisExpression(ctx) {
        return this.visit(ctx.additionExpression);
    }
    function(ctx) {
        const parameters = ctx.parameters.map((p) => this.visit(p));
        const funcName = ctx.function[0].image;
        const func = this.funcs.get(funcName);
        if (!func) {
            console.log(`Function ${funcName} is not defined`);
            return new bignumber_js_1.default(NaN);
        }
        try {
            return func.callback(parameters);
        }
        catch (e) {
            console.log(e);
            return new bignumber_js_1.default(NaN);
        }
    }
}
exports.CalculatorInterpreter = CalculatorInterpreter;
exports.interpreter = new CalculatorInterpreter();
//# sourceMappingURL=interpreter.js.map