import { CstParser } from 'chevrotain';
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
export {};
