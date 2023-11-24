"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTokens = exports.Comma = exports.NumberLiteral = exports.RParen = exports.LParen = exports.PowerOperator = exports.Div = exports.Multi = exports.MultiplicationOperator = exports.Minus = exports.Plus = exports.AdditionOperator = exports.Identifier = exports.AssignOperator = exports.WhiteSpace = exports.NewLine = void 0;
const chevrotain_1 = require("chevrotain");
exports.NewLine = (0, chevrotain_1.createToken)({
    name: 'NewLine',
    pattern: /\n|\r\n?/,
});
exports.WhiteSpace = (0, chevrotain_1.createToken)({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: chevrotain_1.Lexer.SKIPPED,
});
exports.AssignOperator = (0, chevrotain_1.createToken)({
    name: 'AssignOperator',
    pattern: /=/,
});
exports.Identifier = (0, chevrotain_1.createToken)({
    name: 'Identifier',
    pattern: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/,
});
exports.AdditionOperator = (0, chevrotain_1.createToken)({
    name: 'AdditionOperator',
    pattern: chevrotain_1.Lexer.NA,
});
exports.Plus = (0, chevrotain_1.createToken)({
    name: 'Plus',
    pattern: /\+/,
    categories: exports.AdditionOperator,
});
exports.Minus = (0, chevrotain_1.createToken)({
    name: 'Minus',
    pattern: /-/,
    categories: exports.AdditionOperator,
});
exports.MultiplicationOperator = (0, chevrotain_1.createToken)({
    name: 'MultiplicationOperator',
    pattern: chevrotain_1.Lexer.NA,
});
exports.Multi = (0, chevrotain_1.createToken)({
    name: 'Multi',
    pattern: /\*/,
    categories: exports.MultiplicationOperator,
});
exports.Div = (0, chevrotain_1.createToken)({
    name: 'Div',
    pattern: /\//,
    categories: exports.MultiplicationOperator,
});
exports.PowerOperator = (0, chevrotain_1.createToken)({
    name: 'PowerOperator',
    pattern: /\^/,
});
exports.LParen = (0, chevrotain_1.createToken)({ name: 'LParen', pattern: /\(/ });
exports.RParen = (0, chevrotain_1.createToken)({ name: 'RParen', pattern: /\)/ });
exports.NumberLiteral = (0, chevrotain_1.createToken)({
    name: 'NumberLiteral',
    pattern: /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
});
exports.Comma = (0, chevrotain_1.createToken)({ name: 'Comma', pattern: /,/ });
exports.allTokens = [
    exports.NewLine,
    exports.WhiteSpace,
    exports.Plus,
    exports.Minus,
    exports.Multi,
    exports.Div,
    exports.LParen,
    exports.RParen,
    exports.NumberLiteral,
    exports.AssignOperator,
    exports.AdditionOperator,
    exports.MultiplicationOperator,
    exports.PowerOperator,
    exports.Comma,
    exports.Identifier,
];
//# sourceMappingURL=tokens.js.map