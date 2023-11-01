# Calculator Core

## What is this?
Highly extensible interpreter for a simple calculator language.
```ts
import { Engine, StandardFunctions } from "calculator-core";

const engine = new Engine({ functions: StandardFunctions });
engine.execute([
  "ln(e ^ mean(1, 2, 6/2))",
]);
console.log(engine.results); // results is [new BigNumber(2)]
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
