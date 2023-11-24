import BigNumber from 'bignumber.js';
import { Func, Const } from './types';

const funcs: Func[] = [
  {
    name: 'sqrt',
    callback: (args) => {
      if (args.length !== 1 || args[0].isNaN())
        return new BigNumber(NaN);

      const n = Math.sqrt(args[0].toNumber());
      return new BigNumber(n);
    },
    docs: 'takes the square root of the number',
  },
  {
    name: 'ln',
    callback: (args) => {
      if (args.length !== 1 || args[0].isNaN())
        return new BigNumber(NaN);

      const n = Math.round(Math.log(args[0].toNumber()) * 10) / 10;
      return new BigNumber(n);
    },
    docs: 'takes the natural log of the number',
  },
  {
    name: 'log',
    callback: (args) => {
      if (args.length === 0 || args.length > 2 || args[0].isNaN() || (args[1] && args[1]?.isNaN()))
        return new BigNumber(NaN);

      const a = Math.log(args[0].toNumber());
      const b = Math.log(args[1]?.toNumber() ?? 10);
      return new BigNumber(a).div(new BigNumber(b));
    },
    docs: 'log(a, b?) takes the log base b of a with b = 10 as default',
  },
  {
    name: 'pow',
    callback: (args: BigNumber[]) => {
      if (args.length !== 2 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);
      const [base, exp] = args;

      try {
        // BigNumber pow method only accept int as exponent
        return base.pow(exp);
      } catch (e) {
        // walk around for float exponent
        const n = Math.pow(base.toNumber(), exp.toNumber());
        return new BigNumber(n);
      }
    },
    docs: 'pow(a, b) raises a to the b power',
  },
  {
    name: 'sin',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const deg = args[0].dividedBy(new BigNumber(180)).multipliedBy(new BigNumber(Math.PI));
      const n = Math.sin(deg.toNumber())
      return new BigNumber(n);
    },
    docs: 'sin(deg) returns the sine of a number in degrees',
  },
  {
    name: 'cos',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const deg = args[0].dividedBy(new BigNumber(180)).multipliedBy(new BigNumber(Math.PI));
      const n = Math.cos(deg.toNumber())
      return new BigNumber(n);
    },
    docs: 'cos(deg) returns the cosine of a number in degrees',
  },
  {
    name: 'tan',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const deg = args[0].dividedBy(new BigNumber(180)).multipliedBy(new BigNumber(Math.PI));
      const n = Math.tan(deg.toNumber())
      return new BigNumber(n);
    },
    docs: 'tan(deg) returns the tangent of a number in degrees',
  },
  {
    name: 'arcsin',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const rad = Math.asin(args[0].toNumber())
      const deg = new BigNumber(rad).multipliedBy(new BigNumber(180)).dividedBy(new BigNumber(Math.PI));
      return deg;
    },
    docs: 'arcsin(x) returns the inverse sine of x in degrees',
  },
  {
    name: 'arccos',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const rad = Math.acos(args[0].toNumber())
      const deg = new BigNumber(rad).multipliedBy(new BigNumber(180)).dividedBy(new BigNumber(Math.PI));
      return deg;
    },
    docs: 'arccos(x) returns the inverse cosine of x in degrees',
  },
  {
    name: 'arctan',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);

      const rad = Math.atan(args[0].toNumber())
      const deg = new BigNumber(rad).multipliedBy(new BigNumber(180)).dividedBy(new BigNumber(Math.PI));
      return deg;
    },
    docs: 'arctan(x) returns the inverse tangent of x in degrees',
  },
  {
    name: 'abs',
    callback: (args: BigNumber[]) => {
      if (args.length !== 1 || args.some(x => x.isNaN()))
        return new BigNumber(NaN);
      return args[0].abs()
    },
    docs: 'abs(n) returns the absolute value of n',
  },
  {
    name: 'sum',
    callback: (args) => {
      return args.reduce((a, b) => a.plus(b));
    },
    docs: 'sum(...) sums the arguments to the function. If any of the arguments are null, sum will return null',
  },
  {
    name: 'max',
    callback: (args) => {
      if (args.some(v => v.isNaN()))
        return new BigNumber(NaN);
      return args.reduce((a, b) => a.comparedTo(b) < 0 ? b : a);
    },
    docs: 'max(...) returns the maximum of the arguments. If any of the arguments are null, max will return null',
  },
  {
    name: 'min',
    callback: (args) => {
      if (args.some(v => v.isNaN()))
        return new BigNumber(NaN);
      return args.reduce((a, b) => a.comparedTo(b) < 0 ? a : b);
    },
    docs: 'min(...) returns the minimum of the arguments. If any of the arguments are null, min will return null',
  },
  {
    name: 'mean',
    callback: (args) => {
      return args.reduce((a, b) => a.plus(b)).div(args.length);
    },
    docs: 'mean(...) returns the average/mean of the arguments. If any of the arguments are null, mean will return null',
  },
];

const consts: Const[] = [
  {
    name: 'e',
    value: new BigNumber(Math.E),
    docs: 'Euler\'s number',
  },
  {
    name: 'pi',
    value: new BigNumber(Math.PI),
    docs: 'pi',
  },
  {
    name: 'π',
    value: new BigNumber(Math.PI),
    docs: 'pi',
  },
]

export const StandardFunctions: Map<string, Func> = new Map(funcs.map(f => [f.name, f]));
export const StandardConstants: Map<string, Const> = new Map(consts.map(c => [c.name, c]));

