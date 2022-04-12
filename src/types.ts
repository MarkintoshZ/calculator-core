import BigNumber from 'bignumber.js';

export interface Func {
  name: string;
  callback: (args: BigNumber[]) => BigNumber;
  docs: string;
}

export interface Const {
  name: string;
  value: BigNumber;
  docs: string;
}
