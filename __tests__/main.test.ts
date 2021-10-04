import { parse } from '../src/main';

describe('parsing literals', () => {
  it('parse integer', () => {
    const { result } = parse('69');
    expect(result).toStrictEqual([69]);
  });

  it('parse negative integer', () => {
    const { result } = parse('-69');
    expect(result).toStrictEqual([-69]);
  });

  // it('parse float', () => {
  //   const { result } = parse('6.9');
  //   expect(result).toStrictEqual([6.9]);
  // });

  // it('parse float 2', () => {
  //   const { result } = parse('69.69');
  //   expect(result).toStrictEqual([69.69]);
  // });

  // it('parse negative float', () => {
  //   const { result } = parse('-3.14');
  //   expect(result).toStrictEqual([-3.14]);
  // });
});

describe('addition expression', () => {
  it('two integers with spaces in between', () => {
    const { result: res1 } = parse('1 + 2');
    expect(res1).toStrictEqual([3]);
    const { result: res2 } = parse('1 - 2');
    expect(res2).toStrictEqual([-1]);
  });

  it('two integers with no spaces in between', () => {
    const { result: res1 } = parse('1+2');
    expect(res1).toStrictEqual([3]);
    const { result: res2 } = parse('1-2');
    expect(res2).toStrictEqual([-1]);
  });

  it('two negative integers', () => {
    const { result: res1 } = parse('-1 + -2');
    expect(res1).toStrictEqual([-3]);
    const { result: res2 } = parse('-1 - -2');
    expect(res2).toStrictEqual([1]);
  });

  it('positive and negative integer', () => {
    const { result: res1 } = parse('1 + -2');
    expect(res1).toStrictEqual([-1]);
    const { result: res2 } = parse('1 - -2');
    expect(res2).toStrictEqual([3]);
  });

  it('negative and positive integer', () => {
    const { result: res1 } = parse('-1 + 2');
    expect(res1).toStrictEqual([1]);
    const { result: res2 } = parse('-1 - 2');
    expect(res2).toStrictEqual([-3]);
  });
});

describe('multiplication expression', () => {
  it('two integers with spaces in between', () => {
    const { result: res1 } = parse('1 * 2');
    expect(res1).toStrictEqual([2]);
    const { result: res2 } = parse('1 / 2');
    expect(res2).toStrictEqual([0.5]);
  });

  it('two integers with no spaces in between', () => {
    const { result: res1 } = parse('1*2');
    expect(res1).toStrictEqual([2]);
    const { result: res2 } = parse('1/2');
    expect(res2).toStrictEqual([0.5]);
  });

  it('two negative integers', () => {
    const { result: res1 } = parse('-1 * -2');
    expect(res1).toStrictEqual([2]);
    const { result: res2 } = parse('-1 / -2');
    expect(res2).toStrictEqual([0.5]);
  });

  it('positive and negative integer', () => {
    const { result: res1 } = parse('1 * -2');
    expect(res1).toStrictEqual([-2]);
    const { result: res2 } = parse('1 / -2');
    expect(res2).toStrictEqual([-0.5]);
  });

  it('negative and positive integer', () => {
    const { result: res1 } = parse('-1 * 2');
    expect(res1).toStrictEqual([-2]);
    const { result: res2 } = parse('-1 / 2');
    expect(res2).toStrictEqual([-0.5]);
  });
});

describe('negation expression', () => {
  it('single negative integer', () => {
    const { result } = parse('-3102');
    expect(result).toStrictEqual([-3102]);
  })
});

describe('power expression', () => {
  it('two integers with spaces in between', () => {
    const { result } = parse('2 ^ 3');
    expect(result).toStrictEqual([8]);
  });

  it('two integers with no spaces in between', () => {
    const { result } = parse('2^3');
    expect(result).toStrictEqual([8]);
  });

  it('two negative integers', () => {
    const { result } = parse('-2^-3');
    expect(result).toStrictEqual([-0.125]);
  });

  it('positive and negative integer', () => {
    const { result } = parse('2^-3');
    expect(result).toStrictEqual([0.125]);
  });

  it('negative and positive integer', () => {
    const { result } = parse('-2^3');
    expect(result).toStrictEqual([-8]);
  });

  it('three integers', () => {
    const { result } = parse('2 ^ 3 ^ 4');
    expect(result).toStrictEqual([4096]);
  });
});

