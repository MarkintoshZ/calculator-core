import BigNumber from 'bignumber.js';
import { Func } from './types';

const funcs = [
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

      const n = Math.log(args[0].toNumber());
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

export const StandardFunctions: Map<string, Func> = new Map(funcs.map(func => [func.name, func]));

