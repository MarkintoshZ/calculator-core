# Calculator Core

## What is this?
Highly extensible interpreter for a simple calculator language. The desktop app will be open sourced soon.
```ts
import { Engine, StandardFunctions, StandardConstants, BigNumber, Func } from ".";

const my_func: Func = {
  name: 'inverse',
  callback: (args: BigNumber[]) => {
    try {
      return new BigNumber(1 / args[0].toNumber())
    } catch {
      return new BigNumber(NaN);
    }
  },
  docs: 'inverse(x) takes the inverse of number x',
}

const functions = new Map(StandardFunctions);
functions.set('inverse', my_func);

const engine = new Engine({ functions, constants: StandardConstants });
engine.execute([
  "a = ln(e ^ mean(1, 2, 6/2))",
  "inverse(2) * a",
]);
console.log(engine.results.map(r => r.toNumber())); // result: [ 2, 1 ]
```

## Getting Started
### npm scripts
- `clean` - remove coverage data, Jest cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Licence
MIT