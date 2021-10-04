import { lexer, parser, interpreter } from './grammar';

export const parse = (str: string) => {
  const lexResult = lexer.tokenize(str);
  parser.input = lexResult.tokens;
  const cst = parser.lines();
  const result = interpreter.lines(cst);

  return {
    result: result,
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors
  }
}

import * as fs from "fs";
import { createSyntaxDiagramsCode } from "chevrotain";

import { inspect } from 'util';

const input = 
`2 ^ 3 ^ 4` 
console.log(input);
const result = parse(input);
console.log(result.result);
console.log(inspect(result?.cst?.children?.line, false, 2, true));

// extract the serialized grammar.
const serializedGrammar = parser.getSerializedGastProductions()

// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar)

// Write the HTML file to disk
fs.writeFileSync("generated_diagrams.html", htmlText)
