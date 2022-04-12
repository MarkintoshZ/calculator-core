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
    get file() { return this._file; }
    get vars() { return this._vars; }
    get tokens() { return this._tokens; }
    get lexErrors() { return this._lexErrors; }
    get results() { return this._results; }
    get functions() { return this._funcs; }
    get constants() { return this._consts; }
    reloadWith(config = {
        functions: new Map(),
        constants: new Map(),
    }) {
        this._funcs = config.functions;
        this._consts = config.constants;
        this._file = [];
        this._vars = [];
        this._tokens = [];
        this._lexErrors = [];
        this._parseErrors = [];
        this._results = [];
    }
    execute(file) {
        if (file === this._file && this._tokens.length !== 0)
            return;
        let i = this.invalidateCaches(file);
        const stack = new Map();
        for (let j = 0; j < i; j++) {
            if (this._vars[j]) {
                stack.set(this._vars[j], this._results[j]);
            }
        }
        for (; i < file.length; i++) {
            const line = file[i];
            const { tokens, errors } = lexer_1.lexer.tokenize(line);
            this.tokens.push(tokens);
            this._lexErrors.push(errors);
            parser_1.parser.input = tokens;
            const cst = parser_1.parser.lines();
            this._parseErrors.push(parser_1.parser.errors);
            try {
                interpreter_1.interpreter.funcs = this._funcs;
                interpreter_1.interpreter.consts = this._consts;
                const { variable, value } = interpreter_1.interpreter.lines(cst, stack)[0];
                this._vars.push(variable);
                this._results.push(value);
                if (variable) {
                    stack.set(variable, value);
                }
            }
            catch (e) {
                console.log(e);
                this._vars.push(null);
                this._results.push(new bignumber_js_1.default(NaN));
            }
        }
        this._file = file;
    }
    invalidateCaches(file) {
        let i;
        for (i = 0; i < Math.min(file.length, this._file.length); i++) {
            if (file[i] !== this._file[i]) {
                this._vars = this._vars.slice(0, i);
                this._tokens = this._tokens.slice(0, i);
                this._lexErrors = this._lexErrors.slice(0, i);
                this._parseErrors = this._parseErrors.slice(0, i);
                this._results = this._results.slice(0, i);
                break;
            }
        }
        this._vars = this._vars.slice(0, file.length);
        this._tokens = this._tokens.slice(0, file.length);
        this._lexErrors = this._lexErrors.slice(0, file.length);
        this._parseErrors = this._parseErrors.slice(0, file.length);
        this._results = this._results.slice(0, file.length);
        return i;
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map