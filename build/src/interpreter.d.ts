import BigNumber from 'bignumber.js';
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
