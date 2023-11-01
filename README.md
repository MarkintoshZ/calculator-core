# Calculator Core

## What is this?
Highly extensible interpreter for a simple calculator language. The desktop app will be open sourced soon.
```ts
import { Engine, StandardFunctions } from "calculator-core";

const my_func = {
  name: 'meaningOfTheUniverse',
  callback: (_) => new BigNumber(42);
  docs: 'returns the meaning of the universe',
}

const functions = new Map(StandardFunctions);
functions['meaningOfTheUniverse'] = my_func;

const engine = new Engine({ functions });
engine.execute([
  "a = ln(e ^ mean(1, 2, 6/2))",
  "meaningOfTheUniverse() / a",
]);
console.log(engine.results); // result: [new BigNumber(2), new BigNumber(21)]
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
