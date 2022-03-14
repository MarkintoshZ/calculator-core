"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const tokens_1 = require("./tokens");
const chevrotain_1 = require("chevrotain");
class CalculatorParser extends chevrotain_1.CstParser {
    constructor() {
        super(tokens_1.allTokens);
        this.lines = this.RULE('lines', () => {
            this.MANY_SEP({
                SEP: tokens_1.NewLine,
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
            this.CONSUME(tokens_1.Identifier);
            this.CONSUME(tokens_1.AssignOperator);
            this.SUBRULE(this.additionExpression);
        });
        this.additionExpression = this.RULE('additionExpression', () => {
            this.SUBRULE(this.multiplicationExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(tokens_1.AdditionOperator);
                this.SUBRULE2(this.multiplicationExpression, { LABEL: 'rhs' });
            });
        });
        this.multiplicationExpression = this.RULE('multiplicationExpression', () => {
            this.SUBRULE(this.negationExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(tokens_1.MultiplicationOperator);
                this.SUBRULE2(this.negationExpression, { LABEL: 'rhs' });
            });
        });
        this.negationExpression = this.RULE('negationExpression', () => {
            this.OPTION(() => this.CONSUME(tokens_1.Minus, { LABEL: 'negation' }));
            this.SUBRULE(this.powerExpression, { LABEL: 'value' });
        });
        this.negationAtomicExpression = this.RULE('negationAtomicExpression', () => {
            this.OPTION(() => this.CONSUME(tokens_1.Minus, { LABEL: 'negation' }));
            this.SUBRULE(this.atomicExpression, { LABEL: 'value' });
        });
        this.powerExpression = this.RULE('powerExpression', () => {
            this.SUBRULE(this.atomicExpression, { LABEL: 'base' });
            this.MANY(() => {
                this.CONSUME(tokens_1.PowerOperator);
                this.SUBRULE2(this.negationAtomicExpression, { LABEL: 'exponent' });
            });
        });
        this.atomicExpression = this.RULE('atomicExpression', () => this.OR([
            { ALT: () => this.SUBRULE(this.parenthesisExpression) },
            { ALT: () => this.CONSUME(tokens_1.NumberLiteral) },
            { ALT: () => this.SUBRULE(this.function) },
            { ALT: () => this.CONSUME(tokens_1.Identifier) },
        ]));
        this.parenthesisExpression = this.RULE('parenthesisExpression', () => {
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.additionExpression);
            this.CONSUME(tokens_1.RParen);
        });
        this.function = this.RULE('function', () => {
            this.CONSUME(tokens_1.Identifier, { LABEL: 'function' });
            this.CONSUME2(tokens_1.LParen);
            this.MANY_SEP({
                SEP: tokens_1.Comma,
                DEF: () => this.SUBRULE(this.additionExpression, { LABEL: 'parameters' }),
            });
            this.CONSUME3(tokens_1.RParen);
        });
        this.performSelfAnalysis();
    }
}
exports.parser = new CalculatorParser();
//# sourceMappingURL=parser.js.map