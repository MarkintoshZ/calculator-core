import BigNumber from 'bignumber.js';
import { Func, Const } from './types';
declare const BaseCstVisitor: new (...args: any[]) => import("chevrotain").ICstVisitor<any, any>;
export declare class CalculatorInterpreter extends BaseCstVisitor {
    funcs: Map<string, Func>;
    consts: Map<string, Const>;
    variables: Map<string, BigNumber>;
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
