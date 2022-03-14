"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
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
    reloadWith(config) {
        this._funcs = new Map();
        for (const func of config.functions) {
            if (this._funcs.has(func.name)) {
                throw new Error(`engine config contains duplicated functions of 
          name ${func.name}`);
            }
            else {
                this._funcs.set(func.name, func);
            }
        }
        this._consts = new Map();
        for (const constant of config.constants) {
            if (this._consts.has(constant.name)) {
                throw new Error(`engine config contains duplicated constants of 
          name ${constant.name}`);
            }
            else {
                this._consts.set(constant.name, constant);
            }
        }
        this._file = [];
        this._tokens = [];
        this._lexErrors = [];
        this._parseErrors = [];
        this._results = [];
    }
    execute(file) {
        if (file === this._file && this._tokens.length !== 0)
            return;
        let i = this.invalidateCaches(file);
        for (; i < file.length; i++) {
            const line = file[i];
            const { tokens, errors } = lexer_1.lexer.tokenize(line);
            this.tokens.push(tokens);
            this._lexErrors.push(errors);
            const cst = parser_1.parser.lines();
            this._parseErrors.push(parser_1.parser.errors);
            const entries = this._vars
                .map((name, i) => [name, this._results[i]]);
            const stack = new Map(entries.filter(v => v[0] !== null));
            try {
                const { variable, value } = interpreter_1.interpreter.lines(cst, stack)[0];
                this._vars.push(variable);
                this._results.push(value);
            }
            catch (e) {
                console.log(e);
                this._vars.push(null);
                this._results.push(null);
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
                this._results = this._results.slice(0, i);
                break;
            }
        }
        this._vars = this._vars.slice(0, file.length);
        this._tokens = this._tokens.slice(0, file.length);
        this._results = this._results.slice(0, file.length);
        return i;
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map