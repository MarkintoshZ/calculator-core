import BigNumber from 'bignumber.js';
import { createToken, tokenMatcher, Lexer, CstParser } from 'chevrotain';

const NewLine = createToken({
  name: 'NewLine',
  pattern: /\n|\r\n?/,
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const AssignOperator = createToken({ name: 'AssignOperator', pattern: /=/ });
const Variable = createToken({ name: 'Variable', pattern: /[a-zA-Z]\w*/ });

const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA,
});
const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator,
});
const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA,
});
const Multi = createToken({
  name: 'Multi',
  pattern: /\*/,
  categories: MultiplicationOperator,
});
const Div = createToken({
  name: 'Div',
  pattern: /\//,
  categories: MultiplicationOperator,
});

const PowerOperator = createToken({ name: 'PowerOperator', pattern: /\^/ });

const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
});

const Func = createToken({ name: 'Function', pattern: Lexer.NA });
const Sqrt = createToken({
  name: 'PowerSqrt',
  pattern: /sqrt/,
  categories: Func,
});

const Comma = createToken({ name: 'Comma', pattern: /,/ });

const allTokens = [
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

  Sqrt,
  Func,
  Variable,
];

export const lexer = new Lexer(allTokens);

// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
class CalculatorParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public lines = this.RULE('lines', () => {
    this.MANY_SEP({
      SEP: NewLine,
      DEF: () => {
        this.SUBRULE2(this.line);
      },
    });
  });

  private line = this.RULE('line', () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.assignOperation) },
        { ALT: () => this.SUBRULE(this.additionExpression) },
      ]);
    });
  });

  private assignOperation = this.RULE('assignOperation', () => {
    this.CONSUME(Variable);
    this.CONSUME(AssignOperator);
    this.SUBRULE(this.additionExpression);
  });

  //  lowest precedence thus it is first in the rule chain
  // The precedence of binary expressions is determined by how far down the Parse Tree
  // The binary expression appears.
  private additionExpression = this.RULE('additionExpression', () => {
    this.SUBRULE(this.multiplicationExpression, { LABEL: 'lhs' });
    this.MANY(() => {
      // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
      this.CONSUME(AdditionOperator);
      //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
      this.SUBRULE2(this.multiplicationExpression, { LABEL: 'rhs' });
    });
  });

  private multiplicationExpression = this.RULE(
    'multiplicationExpression',
    () => {
      this.SUBRULE(this.negationExpression, { LABEL: 'lhs' });
      this.MANY(() => {
        this.CONSUME(MultiplicationOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        this.SUBRULE2(this.negationExpression, { LABEL: 'rhs' });
      });
    },
  );

  private negationExpression = this.RULE('negationExpression', () => {
    this.OPTION(() => this.CONSUME(Minus, { LABEL: 'negation' }));
    this.SUBRULE(this.powerExpression, { LABEL: 'value' });
  });

  // Can only negatve atomic expressions. Used for exponent of power expression
  private negationAtomicExpression = this.RULE(
    'negationAtomicExpression',
    () => {
      this.OPTION(() => this.CONSUME(Minus, { LABEL: 'negation' }));
      this.SUBRULE(this.atomicExpression, { LABEL: 'value' });
    },
  );

  private powerExpression = this.RULE('powerExpression', () => {
    this.SUBRULE(this.atomicExpression, { LABEL: 'base' });
    this.MANY(() => {
      this.CONSUME(PowerOperator);
      this.SUBRULE2(this.negationAtomicExpression, { LABEL: 'exponent' });
    });
  });

  private atomicExpression = this.RULE('atomicExpression', () =>
    this.OR([
      // parenthesisExpression has the highest precedence and thus it appears
      // in the "lowest" leaf in the expression ParseTree.
      { ALT: () => this.SUBRULE(this.parenthesisExpression) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.SUBRULE(this.function) },
      { ALT: () => this.CONSUME(Variable) },
    ]),
  );

  private parenthesisExpression = this.RULE('parenthesisExpression', () => {
    this.CONSUME(LParen);
    this.SUBRULE(this.additionExpression);
    this.CONSUME(RParen);
  });

  private function = this.RULE('function', () => {
    this.CONSUME(Func, { LABEL: 'function' });
    this.CONSUME2(LParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.additionExpression, { LABEL: 'parameters' }),
    });
    this.CONSUME3(RParen);
  });
}

// wrapping it all together
// reuse the same parser instance.
export const parser = new CalculatorParser();

// ----------------- Interpreter -----------------
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

/**
 * Interprete and calculate the results from the CST
 *
 * @example
 * Set default variables in for the interpreter
 * ```ts
 * const default_variables = new Map(object.entries({
 *   PI: new BigNumber(3.14),
 * }));
 * const interpreter = new CalculatorInterpreter(default_variables);
 * input = lexer.tokenize('a = 2 * PI
 * b = a + 10');
 * let res;
 * try {
 *   res = interpreter.lines(input);
 * } catch (e) {
 *   console.err(e);
 * }
 * // res: [ new BigNumber(6.28), new BigNumber(16.28) ]
 *
 * @example
 * Parse line by line
 * ```ts
 * let stack = new Map<String, BigNumber>();
 * let varaible, value;
 *
 * const interpreter = new CalculatorInterpreter();
 * try {
 *   const tokens = lexer.tokenize('a = 1 + 1')
 *   const cts = parser.parse(tokens)
 *   [ variable, value ] = interpreter.line(cst, stack);
 * } catch (e) {
 *   console.err(e);
 * }
 *
 * if (variable) stack[variable] = value;
 *
 * try {
 *   const tokens = lexer.tokenize('a * 5')
 *   const cts = parser.parse(tokens)
 *   [ variable, value ] = interpreter.line(cst, stack);
 * } catch (e) {
 *   console.err(e);
 * }
 * // value: new BigNumber(10)
 */
class CalculatorInterpreter extends BaseCstVisitor {
  private stack: Map<string, BigNumber> = new Map();

  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Interprete and calculate the results from the CST with one or more lines
   * @param stack - a stack containing all the variables
   */
  lines(ctx, stack: Map<string, BigNumber> = new Map()) {
    this.stack = stack;
    if (ctx?.children?.line)
      return ctx.children.line.map((line) => {
        const { variable, value } = this.visit(line, this.stack);
        this.stack.set(variable, value);
        return { variable, value };
      });
  }

  line(ctx, stack: Map<string, BigNumber> = new Map()) {
    this.stack = stack;
    if (ctx.additionExpression) {
      return { variable: null, value: this.visit(ctx.additionExpression) };
    } else if (ctx.assignOperation) {
      return this.visit(ctx.assignOperation);
    } else {
      return { variable: null, value: null };
    }
  }

  assignOperation(ctx) {
    const variable = ctx.Variable[0].image;
    const value = this.visit(ctx.additionExpression);
    // delay assigning the value to the variable name to `line`
    return { variable, value };
  }

  additionExpression(ctx) {
    let result: BigNumber = this.visit(ctx.lhs);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.AdditionOperator[idx];

        if (tokenMatcher(operator, Plus)) {
          result = result.plus(rhsValue);
        } else {
          // Minus
          result = result.minus(rhsValue);
        }
      });
    }

    return result;
  }

  multiplicationExpression(ctx) {
    let result: BigNumber = this.visit(ctx.lhs);
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.MultiplicationOperator[idx];

        if (tokenMatcher(operator, Multi)) {
          result = result.multipliedBy(rhsValue);
        } else {
          // Division
          result = result.dividedBy(rhsValue);
        }
      });
    }

    return result;
  }

  negationExpression(ctx) {
    const result: BigNumber = this.visit(ctx.value);
    return ctx.negation ? result.negated() : result;
  }

  negationAtomicExpression(ctx) {
    const result: BigNumber = this.visit(ctx.value);
    return ctx.negation ? result.negated() : result;
  }

  powerExpression(ctx) {
    let base: BigNumber = this.visit(ctx.base);

    if (ctx.exponent) {
      ctx.exponent.reverse().forEach((expNode) => {
        const exp = this.visit(expNode);
        try {
          // BigNumber pow method only accept int as exponent
          base = base.pow(exp);
        } catch (e) {
          // walk around for float exponent
          const n = Math.pow(base.toNumber(), exp.toNumber());
          base = new BigNumber(n);
        }
      });
    }

    return base;
  }

  atomicExpression(ctx) {
    if (ctx.parenthesisExpression) {
      // passing an array to "this.visit" is equivalent
      // to passing the array's first element
      return this.visit(ctx.parenthesisExpression);
    } else if (ctx.NumberLiteral) {
      // If a key exists on the ctx, at least one element is guaranteed
      return new BigNumber(ctx.NumberLiteral[0].image);
    } else if (ctx.function) {
      return this.visit(ctx.function);
    } else if (ctx.Variable) {
      const varName = ctx.Variable[0].image;
      const value = this.stack.get(varName);
      if (!value) throw Error(`Use of undefined variable "${varName}"`);
      return value;
    }
  }

  parenthesisExpression(ctx) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.additionExpression);
  }

  function(ctx) {
    const parameters = ctx.parameters.map((p) => this.visit(p));
    if (tokenMatcher(ctx.function[0], Sqrt) && parameters.length == 1) {
      const n = Math.sqrt(parameters[0]);
      return new BigNumber(n);
    }
    return new BigNumber(null);
  }
}

export const interpreter = new CalculatorInterpreter();
