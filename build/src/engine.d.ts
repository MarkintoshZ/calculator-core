import BigNumber from 'bignumber.js';
import { IToken, ILexingError } from 'chevrotain';
export interface Func {
    name: string;
    callback: (args: BigNumber[]) => BigNumber | null;
    docs: string;
}
export interface Constant {
    name: string;
    value: BigNumber;
    docs: string;
}
export interface EngineConfig {
    functions: Func[];
    constants: Constant[];
}
export declare class Engine {
    private _file;
    private _vars;
    private _tokens;
    private _lexErrors;
    private _parseErrors;
    private _results;
    private _funcs;
    private _consts;
    get file(): string[];
    get vars(): (string | null)[];
    get tokens(): IToken[][];
    get lexErrors(): ILexingError[][];
    get results(): (BigNumber | null)[];
    get functions(): Map<string, Func>;
    get constants(): Map<string, Constant>;
    constructor(config: EngineConfig);
    reloadWith(config: EngineConfig): void;
    execute(file: string[]): void;
    private invalidateCaches;
}
