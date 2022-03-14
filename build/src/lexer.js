"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
exports.lexer = new chevrotain_1.Lexer(tokens_1.allTokens);
//# sourceMappingURL=lexer.js.map