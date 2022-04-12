import { Engine, BigNumber, StandardFunctions } from '../src';

describe('Engine Calculation', () => {
  it('basic chained operations', () => {
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
      new BigNumber("NaN"),
      new BigNumber(2.25),
      new BigNumber("NaN"),
    ]);
  });

  it('efficient re-evaulation', () => {
    const input = `a = 10 * -2
       b = (30 / a)^2
       c = 90 - a * b`;
    const engine = new Engine({});
    engine.execute(input.split('\n'));

    const input_new = `a = 10 * -2
       b = (30 / 5)^2
       c = 90 - a * b`;
    engine.execute(input_new.split('\n'));

    expect(engine.results).toStrictEqual([
      new BigNumber(-20),
      new BigNumber(36),
      new BigNumber(810),
    ]);
  });

});

describe('Engine Config', () => {
  it('loading StandardFunctions', () => {
    const engine = new Engine({ functions: StandardFunctions });
    const input = `a = log(1)
       b = mean(5, 2, a, 9)
       min(13, 200, b, 8)`;
    engine.execute(input.split('\n'));
    expect(engine.results).toStrictEqual([
      new BigNumber(0),
      new BigNumber(4),
      new BigNumber(4),
    ]);
  });

  it('handling function not defined errors', () => {
    const input = `a = buggy(10 * -2)
       b = (30 / 20)^2
       c = 90 - a * b`;
    const engine = new Engine({});
    engine.execute(input.split('\n'));
    expect(engine.results).toStrictEqual([
      new BigNumber("NaN"),
      new BigNumber(2.25),
      new BigNumber("NaN"),
    ]);
  });
});
