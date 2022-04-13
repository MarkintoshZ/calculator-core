import BigNumber from 'bignumber.js';
import { IToken, ILexingError, IRecognitionException } from 'chevrotain';
import { lexer } from './lexer';
import { parser } from './parser';
import { interpreter } from './interpreter';
import { Func, Const } from './types';

/**
 * Configuration object for Engine.
 */
export interface EngineConfig {
  functions?: Map<string, Func>;
  constants?: Map<string, Const>;
}

/**
 * Engine class.
 *
 * @example
 * const engine = new Engine({});
 * engine.execute(["1 + 2"]);
 * const results = engine.results;
 * // results is [new BigNumber(3)]
 */
export class Engine {
  private _linesCache: string[];

  private _vars: (string | null)[];
  private _tokens: IToken[][];
  private _lexErrors: ILexingError[][];
  private _parseErrors: IRecognitionException[][];
  private _results: BigNumber[];

  private _funcs: Map<string, Func>;
  private _consts: Map<string, Const>;

  public get file(): string[] { return this._linesCache; }

  public get vars(): (string | null)[] { return this._vars; }
  public get tokens(): IToken[][] { return this._tokens; }
  public get lexErrors(): ILexingError[][] { return this._lexErrors; }
  public get results(): BigNumber[] { return this._results; }

  public get functions(): Map<string, Func> { return this._funcs; }
  public get constants(): Map<string, Const> { return this._consts; }

  /**
   * Construct a new Engine from EngineConfig
   * @param config EngineConfig
   */
  constructor(config?: EngineConfig) {
    this.reloadWith(config);
  }

  /**
   * Reload the engine with new configuration.
   * @param config EngineConfig
   */
  public reloadWith(
    config: EngineConfig = {
      functions: new Map(),
      constants: new Map(),
    },
  ): void {
    this._funcs = config.functions;
    this._consts = config.constants;

    this._linesCache = [];
    this._vars = [];
    this._tokens = [];
    this._lexErrors = [];
    this._parseErrors = [];
    this._results = [];
  }

  /**
   * Execute the given code.
   * @param lines Code to execute
   */
  public execute(lines: string[]): void {
    // prevent redundant state change
    if (lines === this._linesCache && this._tokens.length !== 0) return;

    // get line number of line change
    let i = this.invalidateCaches(lines);

    // load varaibles defined previously
    const stack = new Map<string, BigNumber>();
    for (let j = 0; j < i; j++) {
      if (this._vars[j]) {
        stack.set(this._vars[j], this._results[j])
      }
    }

    // Parse and excute section of the code that is downstream(below) of the change
    // Execute line by line
    for (; i < lines.length; i++) {
      const line = lines[i];

      // tokenize
      const { tokens, errors } = lexer.tokenize(line);
      this.tokens.push(tokens);
      this._lexErrors.push(errors);

      // parse
      parser.input = tokens;
      const cst = parser.lines();
      this._parseErrors.push(parser.errors);

      try {
        interpreter.funcs = this._funcs;
        interpreter.consts = this._consts;
        const { variable, value } = interpreter.lines(cst, stack)[0];
        this._vars.push(variable);
        this._results.push(value);
        if (variable) {
          stack.set(variable, value);
        }
      } catch (e) {
       console.log(e);
        this._vars.push(null);
        this._results.push(new BigNumber(NaN));
      }
    }

    this._linesCache = lines;
  }

  private invalidateCaches(file: string[]): number {
    // Only update the lines after the code change
    // Find the index where cache should be invalidated
    let i: number;
    for (i = 0; i < Math.min(file.length, this._linesCache.length); i++) {
      if (file[i] !== this._linesCache[i]) {
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
