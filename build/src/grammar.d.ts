import BigNumber from 'bignumber.js';
import { Lexer, CstParser } from 'chevrotain';
export declare const lexer: Lexer;
declare class CalculatorParser extends CstParser {
    constructor();
    lines: (idxInCallingRule?: number, ...args: any[]) => import("chevrotain").CstNode;
    private line;
    private assignOperation;
    private additionExpression;
    private multiplicationExpression;
    private negationExpression;
    private negationAtomicExpression;
    private powerExpression;
    private atomicExpression;
    private parenthesisExpression;
    private function;
}
export declare const parser: CalculatorParser;
declare const BaseCstVisitor: new (...args: any[]) => import("chevrotain").ICstVisitor<any, any>;
declare class CalculatorInterpreter extends BaseCstVisitor {
    private variables;
    constructor();
    lines(ctx: any, stack?: Map<string, BigNumber>): any;
    line(ctx: any, stack?: Map<string, BigNumber>): any;
    assignOperation(ctx: any): {
        variable: any;
        value: any;
    };
    additionExpression(ctx: any): BigNumber;
    multiplicationExpression(ctx: any): BigNumber;
    negationExpression(ctx: any): BigNumber;
    negationAtomicExpression(ctx: any): BigNumber;
    powerExpression(ctx: any): BigNumber;
    atomicExpression(ctx: any): any;
    parenthesisExpression(ctx: any): any;
    function(ctx: any): BigNumber;
}
export declare const interpreter: CalculatorInterpreter;
export {};
