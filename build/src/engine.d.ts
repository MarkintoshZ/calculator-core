import BigNumber from 'bignumber.js';
import { IToken, ILexingError } from 'chevrotain';
import { Func, Const } from './types';
export interface EngineConfig {
    functions?: Map<string, Func>;
    constants?: Map<string, Const>;
}
export declare class Engine {
    private _linesCache;
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
    get results(): BigNumber[];
    get functions(): Map<string, Func>;
    get constants(): Map<string, Const>;
    constructor(config?: EngineConfig);
    reloadWith(config: EngineConfig): void;
    execute(lines: string[]): void;
    private invalidateCaches;
}
