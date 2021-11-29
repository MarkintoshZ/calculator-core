export { BigNumber } from 'bignumber.js';
export { CstNode, IToken } from 'chevrotain';
export { lexer, parser, interpreter } from './grammar';

// The following are for testing purposes only
// import { ILexingError, IRecognitionException } from 'chevrotain';
// import { lexer, parser, interpreter } from './grammar';
//
// interface ParsedResult {
//   result: BigNumber[];
//   cst: any;
//   lexErrors: ILexingError[];
//   parseErrors: IRecognitionException[];
// }
// 
// export const parse = (str: string): ParsedResult => {
//   const lexResult = lexer.tokenize(str);
//   parser.input = lexResult.tokens;
//   const cst = parser.lines();
//   const result = interpreter.lines(cst);
// 
//   return {
//     result: result.map((v) => v.value),
//     cst: cst,
//     lexErrors: lexResult.errors,
//     parseErrors: parser.errors,
//   };
// };
// 
// import * as fs from 'fs';
// import { createSyntaxDiagramsCode } from 'chevrotain';
// 
// import { inspect } from 'util';
// import BigNumber from 'bignumber.js';
// 
// const input = `a * 2`;
// console.log(input);
// const result = parse(input);
// console.log(inspect(result), false, 2, true);
// console.log('result: ', result.result?.map(n => n.toNumber()));
// console.log(inspect(result?.cst?.children?.line, false, 2, true));
// 
// // extract the serialized grammar.
// const serializedGrammar = parser.getSerializedGastProductions();
// 
// // create the HTML Text
// const htmlText = createSyntaxDiagramsCode(serializedGrammar);
// 
// // Write the HTML file to disk
// fs.writeFileSync('generated_diagrams.html', htmlText);
