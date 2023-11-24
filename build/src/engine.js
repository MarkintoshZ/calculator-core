"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const bignumber_js_1 = require("bignumber.js");
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const interpreter_1 = require("./interpreter");
class Engine {
    constructor(config) {
        this.reloadWith(config);
    }
    get file() { return this._linesCache; }
    get vars() { return this._vars; }
    get tokens() { return this._tokens; }
    get lexErrors() { return this._lexErrors; }
    get results() { return this._results; }
    get functions() { return this._funcs; }
    get constants() { return this._consts; }
    reloadWith(config) {
        var _a, _b;
        this._funcs = (_a = config.functions) !== null && _a !== void 0 ? _a : new Map();
        this._consts = (_b = config.constants) !== null && _b !== void 0 ? _b : new Map();
        this._linesCache = [];
        this._vars = [];
        this._tokens = [];
        this._lexErrors = [];
        this._parseErrors = [];
        this._results = [];
    }
    execute(lines) {
        if (lines === this._linesCache && this._tokens.length !== 0)
            return;
        let i = this.invalidateCaches(lines);
        const env = new Map();
        this.constants.forEach(c => env.set(c.name, c.value));
        for (let j = 0; j < i; j++) {
            if (this._vars[j]) {
                env.set(this._vars[j], this._results[j]);
            }
        }
        for (; i < lines.length; i++) {
            const line = lines[i];
            const { tokens, errors } = lexer_1.lexer.tokenize(line);
            this.tokens.push(tokens);
            this._lexErrors.push(errors);
            parser_1.parser.input = tokens;
            const cst = parser_1.parser.lines();
            this._parseErrors.push(parser_1.parser.errors);
            try {
                interpreter_1.interpreter.funcs = this._funcs;
                interpreter_1.interpreter.consts = this._consts;
                const { variable, value } = interpreter_1.interpreter.lines(cst, env)[0];
                this._vars.push(variable);
                this._results.push(value);
                if (variable) {
                    env.set(variable, value);
                }
            }
            catch (e) {
                console.log(e);
                this._vars.push(null);
                this._results.push(new bignumber_js_1.default(NaN));
            }
        }
        this._linesCache = lines;
    }
    invalidateCaches(buffers) {
        let i;
        for (i = 0; i < Math.min(buffers.length, this._linesCache.length); i++) {
            if (buffers[i] !== this._linesCache[i]) {
                this._vars = this._vars.slice(0, i);
                this._tokens = this._tokens.slice(0, i);
                this._lexErrors = this._lexErrors.slice(0, i);
                this._parseErrors = this._parseErrors.slice(0, i);
                this._results = this._results.slice(0, i);
                break;
            }
        }
        this._vars = this._vars.slice(0, buffers.length);
        this._tokens = this._tokens.slice(0, buffers.length);
        this._lexErrors = this._lexErrors.slice(0, buffers.length);
        this._parseErrors = this._parseErrors.slice(0, buffers.length);
        this._results = this._results.slice(0, buffers.length);
        return i;
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map