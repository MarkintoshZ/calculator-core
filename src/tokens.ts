import { createToken, Lexer } from 'chevrotain';

export const NewLine = createToken({
  name: 'NewLine',
  pattern: /\n|\r\n?/,
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const AssignOperator = createToken({
  name: 'AssignOperator',
  pattern: /=/,
});
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z]\w*/,
});

export const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA,
});
export const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator,
});
export const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator,
});

export const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA,
});
export const Multi = createToken({
  name: 'Multi',
  pattern: /\*/,
  categories: MultiplicationOperator,
});
export const Div = createToken({
  name: 'Div',
  pattern: /\//,
  categories: MultiplicationOperator,
});

export const PowerOperator = createToken({
  name: 'PowerOperator',
  pattern: /\^/,
});

export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });
export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
});

export const Comma = createToken({ name: 'Comma', pattern: /,/ });

export const allTokens = [
  // line break must be before whitespace
  NewLine,
  WhiteSpace,

  // Operators (from lower precedence to higher precendence)
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  NumberLiteral,
  AssignOperator,
  AdditionOperator,
  MultiplicationOperator,
  PowerOperator,
  Comma,
  Identifier,
];
