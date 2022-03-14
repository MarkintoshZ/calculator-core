import { Engine, BigNumber } from '../src';

describe('Engine', () => {
  it('testcase 1', () => {
    const input = `a = 10 * -2
       b = (30 / 20)^2
       c = 90 - a * b`;
    const engine = new Engine({});
    engine.execute(input.split('\n'));
    expect(engine.results).toStrictEqual([
      new BigNumber(-20),
      new BigNumber(2.25),
      new BigNumber(135),
    ]);
  });

  it('handling syntax errors', () => {
    const input = `a = 10 ** -2
       b = (30 / 20)^2
       c = 90 - a * b`;
    const engine = new Engine({});
    engine.execute(input.split('\n'));
    expect(engine.results).toStrictEqual([
      null,
      new BigNumber(2.25),
      null,
    ]);
  });
});

