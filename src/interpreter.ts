import BigNumber from 'bignumber.js';
import { tokenMatcher } from 'chevrotain';
import { Plus, Multi } from './tokens';
import { parser } from './parser';
import { Func, Const } from './types';

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
  public funcs: Map<string, Func>;
  public consts: Map<string, Const>;
  public variables: Map<string, BigNumber>;

  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Interprete and calculate the results from the CST with one or more lines
   * @param stack - a stack containing all the variables
   */
  lines(ctx, stack: Map<string, BigNumber> = new Map()) {
    this.variables = stack;
    if (ctx?.children?.line)
      return ctx.children.line.map((line) => {
        const { variable, value } = this.visit(line, this.variables);
        this.variables.set(variable, value);
        return { variable, value };
      });
  }

  line(ctx, stack: Map<string, BigNumber> = new Map()) {
    this.variables = stack;
    if (ctx.additionExpression) {
      return { variable: null, value: this.visit(ctx.additionExpression) };
    } else if (ctx.assignOperation) {
      return this.visit(ctx.assignOperation);
    } else {
      return { variable: null, value: null };
    }
  }

  assignOperation(ctx) {
    const variable = ctx.Identifier[0].image;
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
    } else if (ctx.Identifier) {
      const varName = ctx.Identifier[0].image;
      const value = this.variables.get(varName);
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
    if (ctx.function[0].image === 'sqrt' && parameters.length == 1) {
      const n = Math.sqrt(parameters[0]);
      return new BigNumber(n);
    }
    return new BigNumber(null);
  }
}

export const interpreter = new CalculatorInterpreter();
