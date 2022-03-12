"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreter = exports.parser = exports.lexer = void 0;
const bignumber_js_1 = require("bignumber.js");
const chevrotain_1 = require("chevrotain");
const NewLine = (0, chevrotain_1.createToken)({
    name: 'NewLine',
    pattern: /\n|\r\n?/,
});
const WhiteSpace = (0, chevrotain_1.createToken)({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: chevrotain_1.Lexer.SKIPPED,
});
const AssignOperator = (0, chevrotain_1.createToken)({ name: 'AssignOperator', pattern: /=/ });
const Identifier = (0, chevrotain_1.createToken)({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ });
const AdditionOperator = (0, chevrotain_1.createToken)({
    name: 'AdditionOperator',
    pattern: chevrotain_1.Lexer.NA,
});
const Plus = (0, chevrotain_1.createToken)({
    name: 'Plus',
    pattern: /\+/,
    categories: AdditionOperator,
});
const Minus = (0, chevrotain_1.createToken)({
    name: 'Minus',
    pattern: /-/,
    categories: AdditionOperator,
});
const MultiplicationOperator = (0, chevrotain_1.createToken)({
    name: 'MultiplicationOperator',
    pattern: chevrotain_1.Lexer.NA,
});
const Multi = (0, chevrotain_1.createToken)({
    name: 'Multi',
    pattern: /\*/,
    categories: MultiplicationOperator,
});
const Div = (0, chevrotain_1.createToken)({
    name: 'Div',
    pattern: /\//,
    categories: MultiplicationOperator,
});
const PowerOperator = (0, chevrotain_1.createToken)({ name: 'PowerOperator', pattern: /\^/ });
const LParen = (0, chevrotain_1.createToken)({ name: 'LParen', pattern: /\(/ });
const RParen = (0, chevrotain_1.createToken)({ name: 'RParen', pattern: /\)/ });
const NumberLiteral = (0, chevrotain_1.createToken)({
    name: 'NumberLiteral',
    pattern: /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
});
const Comma = (0, chevrotain_1.createToken)({ name: 'Comma', pattern: /,/ });
const allTokens = [
    NewLine,
    WhiteSpace,
    Plus,
    Minus,
    Multi,
    Div,
    LParen,
    RParen,
    NumberLiteral,
    AssignOperator,
    AdditionOperator,
    MultiplicationOperator,
    PowerOperator,
    Comma,
    Identifier,
];
exports.lexer = new chevrotain_1.Lexer(allTokens);
class CalculatorParser extends chevrotain_1.CstParser {
    constructor() {
        super(allTokens);
        this.lines = this.RULE('lines', () => {
            this.MANY_SEP({
                SEP: NewLine,
                DEF: () => {
                    this.SUBRULE2(this.line);
                },
            });
        });
        this.line = this.RULE('line', () => {
            this.OPTION(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.assignOperation) },
                    { ALT: () => this.SUBRULE(this.additionExpression) },
                ]);
            });
        });
        this.assignOperation = this.RULE('assignOperation', () => {
            this.CONSUME(Identifier);
            this.CONSUME(AssignOperator);
            this.SUBRULE(this.additionExpression);
        });
        this.additionExpression = this.RULE('additionExpression', () => {
            this.SUBRULE(this.multiplicationExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(AdditionOperator);
                this.SUBRULE2(this.multiplicationExpression, { LABEL: 'rhs' });
            });
        });
        this.multiplicationExpression = this.RULE('multiplicationExpression', () => {
            this.SUBRULE(this.negationExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(MultiplicationOperator);
                this.SUBRULE2(this.negationExpression, { LABEL: 'rhs' });
            });
        });
        this.negationExpression = this.RULE('negationExpression', () => {
            this.OPTION(() => this.CONSUME(Minus, { LABEL: 'negation' }));
            this.SUBRULE(this.powerExpression, { LABEL: 'value' });
        });
        this.negationAtomicExpression = this.RULE('negationAtomicExpression', () => {
            this.OPTION(() => this.CONSUME(Minus, { LABEL: 'negation' }));
            this.SUBRULE(this.atomicExpression, { LABEL: 'value' });
        });
        this.powerExpression = this.RULE('powerExpression', () => {
            this.SUBRULE(this.atomicExpression, { LABEL: 'base' });
            this.MANY(() => {
                this.CONSUME(PowerOperator);
                this.SUBRULE2(this.negationAtomicExpression, { LABEL: 'exponent' });
            });
        });
        this.atomicExpression = this.RULE('atomicExpression', () => this.OR([
            { ALT: () => this.SUBRULE(this.parenthesisExpression) },
            { ALT: () => this.CONSUME(NumberLiteral) },
            { ALT: () => this.SUBRULE(this.function) },
            { ALT: () => this.CONSUME(Identifier) },
        ]));
        this.parenthesisExpression = this.RULE('parenthesisExpression', () => {
            this.CONSUME(LParen);
            this.SUBRULE(this.additionExpression);
            this.CONSUME(RParen);
        });
        this.function = this.RULE('function', () => {
            this.CONSUME(Identifier, { LABEL: 'function' });
            this.CONSUME2(LParen);
            this.MANY_SEP({
                SEP: Comma,
                DEF: () => this.SUBRULE(this.additionExpression, { LABEL: 'parameters' }),
            });
            this.CONSUME3(RParen);
        });
        this.performSelfAnalysis();
    }
}
exports.parser = new CalculatorParser();
const BaseCstVisitor = exports.parser.getBaseCstVisitorConstructor();
class CalculatorInterpreter extends BaseCstVisitor {
    constructor() {
        super();
        this.variables = new Map();
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
            return { variable: null, value: null };
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
                if ((0, chevrotain_1.tokenMatcher)(operator, Plus)) {
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
                if ((0, chevrotain_1.tokenMatcher)(operator, Multi)) {
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
            const value = this.variables.get(varName);
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
        if (ctx.function[0].image === "sqrt" && parameters.length == 1) {
            const n = Math.sqrt(parameters[0]);
            return new bignumber_js_1.default(n);
        }
        return new bignumber_js_1.default(null);
    }
}
exports.interpreter = new CalculatorInterpreter();
//# sourceMappingURL=grammar.js.map