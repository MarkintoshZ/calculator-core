import { 
  allTokens, 
  NewLine,
  Minus,
  LParen,
  RParen,
  NumberLiteral,
  AssignOperator,
  AdditionOperator,
  MultiplicationOperator,
  PowerOperator,
  Comma,
  Identifier,
} from './tokens'
import { CstParser } from 'chevrotain';

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
    this.CONSUME(Identifier);
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
      { ALT: () => this.CONSUME(Identifier) },
    ]),
  );

  private parenthesisExpression = this.RULE('parenthesisExpression', () => {
    this.CONSUME(LParen);
    this.SUBRULE(this.additionExpression);
    this.CONSUME(RParen);
  });

  private function = this.RULE('function', () => {
    this.CONSUME(Identifier, { LABEL: 'function' });
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

