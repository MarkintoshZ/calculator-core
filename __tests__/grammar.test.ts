import { BigNumber } from 'bignumber.js';
import { ILexingError, IRecognitionException } from 'chevrotain';
import { lexer, parser, interpreter } from '../src/grammar';

interface ParsedResult {
  result: BigNumber[];
  cst: unknown;
  lexErrors: ILexingError[];
  parseErrors: IRecognitionException[];
}

const parse = (str: string): ParsedResult => {
  const lexResult = lexer.tokenize(str);
  parser.input = lexResult.tokens;
  const cst = parser.lines();
  const result = interpreter.lines(cst);

  return {
    result: result.map((v) => v.value),
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
};

describe('parsing literals', () => {
  it('parse integer', () => {
    const { result } = parse('69');
    expect(result).toStrictEqual([new BigNumber(69)]);
  });

  it('parse negative integer', () => {
    const { result } = parse('-69');
    expect(result).toStrictEqual([new BigNumber(-69)]);
  });

  it('parse float', () => {
    const { result: res1 } = parse('6.9');
    expect(res1).toStrictEqual([new BigNumber(6.9)]);
    const { result: res2 } = parse('69.69');
    expect(res2).toStrictEqual([new BigNumber(69.69)]);
  });

  it('parse scientific', () => {
    const { result: res1 } = parse('1.23e5');
    expect(res1).toStrictEqual([new BigNumber(1.23e5)]);
    const { result: res2 } = parse('1.23E5');
    expect(res2).toStrictEqual([new BigNumber(1.23e5)]);
    const { result: res3 } = parse('1.23e-5');
    expect(res3).toStrictEqual([new BigNumber(1.23e-5)]);
    const { result: res4 } = parse('1.23E-5');
    expect(res4).toStrictEqual([new BigNumber(1.23e-5)]);
  });
});

describe('addition expression', () => {
  it('two integers with spaces in between', () => {
    const { result: res1 } = parse('1 + 2');
    expect(res1).toStrictEqual([new BigNumber(3)]);
    const { result: res2 } = parse('1 - 2');
    expect(res2).toStrictEqual([new BigNumber(-1)]);
  });

  it('two integers with no spaces in between', () => {
    const { result: res1 } = parse('1+2');
    expect(res1).toStrictEqual([new BigNumber(3)]);
    const { result: res2 } = parse('1-2');
    expect(res2).toStrictEqual([new BigNumber(-1)]);
  });

  it('two negative integers', () => {
    const { result: res1 } = parse('-1 + -2');
    expect(res1).toStrictEqual([new BigNumber(-3)]);
    const { result: res2 } = parse('-1 - -2');
    expect(res2).toStrictEqual([new BigNumber(1)]);
  });

  it('positive and negative integer', () => {
    const { result: res1 } = parse('1 + -2');
    expect(res1).toStrictEqual([new BigNumber(-1)]);
    const { result: res2 } = parse('1 - -2');
    expect(res2).toStrictEqual([new BigNumber(3)]);
  });

  it('negative and positive integer', () => {
    const { result: res1 } = parse('-1 + 2');
    expect(res1).toStrictEqual([new BigNumber(1)]);
    const { result: res2 } = parse('-1 - 2');
    expect(res2).toStrictEqual([new BigNumber(-3)]);
  });
});

describe('multiplication expression', () => {
  it('two integers with spaces in between', () => {
    const { result: res1 } = parse('1 * 2');
    expect(res1).toStrictEqual([new BigNumber(2)]);
    const { result: res2 } = parse('1 / 2');
    expect(res2).toStrictEqual([new BigNumber(0.5)]);
  });

  it('two integers with no spaces in between', () => {
    const { result: res1 } = parse('1*2');
    expect(res1).toStrictEqual([new BigNumber(2)]);
    const { result: res2 } = parse('1/2');
    expect(res2).toStrictEqual([new BigNumber(0.5)]);
  });

  it('two negative integers', () => {
    const { result: res1 } = parse('-1 * -2');
    expect(res1).toStrictEqual([new BigNumber(2)]);
    const { result: res2 } = parse('-1 / -2');
    expect(res2).toStrictEqual([new BigNumber(0.5)]);
  });

  it('positive and negative integer', () => {
    const { result: res1 } = parse('1 * -2');
    expect(res1).toStrictEqual([new BigNumber(-2)]);
    const { result: res2 } = parse('1 / -2');
    expect(res2).toStrictEqual([new BigNumber(-0.5)]);
  });

  it('negative and positive integer', () => {
    const { result: res1 } = parse('-1 * 2');
    expect(res1).toStrictEqual([new BigNumber(-2)]);
    const { result: res2 } = parse('-1 / 2');
    expect(res2).toStrictEqual([new BigNumber(-0.5)]);
  });
});

describe('negation expression', () => {
  it('single negative integer', () => {
    const { result } = parse('-3102');
    expect(result).toStrictEqual([new BigNumber(-3102)]);
  });
});

describe('power expression', () => {
  it('two integers with spaces in between', () => {
    const { result } = parse('2 ^ 3');
    expect(result).toStrictEqual([new BigNumber(8)]);
  });

  it('two integers with no spaces in between', () => {
    const { result } = parse('2^3');
    expect(result).toStrictEqual([new BigNumber(8)]);
  });

  it('two negative integers', () => {
    const { result } = parse('-2^-3');
    expect(result).toStrictEqual([new BigNumber(-0.125)]);
  });

  it('positive and negative integer', () => {
    const { result } = parse('2^-3');
    expect(result).toStrictEqual([new BigNumber(0.125)]);
  });

  it('negative and positive integer', () => {
    const { result } = parse('-2^3');
    expect(result).toStrictEqual([new BigNumber(-8)]);
  });

  it('three integers', () => {
    const { result } = parse('2 ^ 3 ^ 4');
    expect(result).toStrictEqual([new BigNumber(4096)]);
  });

  it('float as exponent', () => {
    const { result } = parse('4 ^ (3 / 2)');
    expect(result).toStrictEqual([new BigNumber(8)]);
  });
});

describe('order of precedence', () => {
  it('testcase 1', () => {
    const { result } = parse('4 + 5 * 4^-1^(1/2)');
    expect(result).toStrictEqual([new BigNumber(6.5)]);
  });

  it('testcase 2', () => {
    const { result } = parse('5 ^ -2 * 8');
    expect(result).toStrictEqual([new BigNumber(0.32)]);
  });
});

describe('variables', () => {
  it('testcase 1', () => {
    const input = `a = 10 * -2
       b = (a / 20)^2
       c = 90 - a * b`;
    const { result } = parse(input);
    expect(result).toStrictEqual([
      new BigNumber(-20),
      new BigNumber(1),
      new BigNumber(110),
    ]);
  });
});
