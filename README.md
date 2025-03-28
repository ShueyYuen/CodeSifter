# CodeSifter

A powerful plugin for webpack, rollup, vite, and other bundlers that provides conditional compilation based on comment directives.

## Installation

```bash
npm install code-sifter --save-dev
```

## Features

- Conditional code inclusion/exclusion using comment directives
- Supports multiple file types (JavaScript, HTML, CSS, Vue, etc.)
- Works with multiple bundlers (webpack, rollup, vite, esbuild, rspack, farm)
- Simple configuration
- Smart whitespace cleanup to maintain code formatting

## Usage

This plugin processes special comment directives to include or exclude code based on conditions:

- `/* #if CONDITION */` - Start a conditional block
- `/* #else */` - Alternative code
- `/* #endif */` - End a conditional block

For HTML files, use HTML comments: `<!-- #if CONDITION -->`, etc.

### Example

Source code:
```javascript
/* #if IS_LINUX */
import { createServer } from './create-linux-server';
/* #else */
import { createServer } from './create-server';
/* #endif */
const a = createServer({ delay: /* #if IS_LINUX */ 600 /* #else */ 100 /* #endif */, });
```

When processed with `{ IS_LINUX: false }`, becomes:
```javascript
import { createServer } from './create-server';
const a = createServer({ delay: 100, });
```

> [!WARNING]
> While this plugin supports conditional code removal via comments, this approach doesn't conform to standard JavaScript/TypeScript syntax and may not be considered best practice. Consider using proper imports and exports with tree-shaking capabilities of modern bundlers for a more maintainable codebase.

## Configuration

### Webpack

```javascript
// webpack.config.js
const ConditionalCode = require('code-sifter/webpack');

module.exports = {
  // ...
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

### Rollup

```javascript
// rollup.config.js
import ConditionalCode from 'code-sifter/rollup';

export default {
  // ...
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import ConditionalCode from 'code-sifter/vite';

export default defineConfig({
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
});
```

### Esbuild

```javascript
import { build } from 'esbuild';
import ConditionalCode from 'code-sifter/esbuild';

build({
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ],
});
```

### Rspack

```javascript
// rspack.config.js
import ConditionalCode from 'code-sifter/rspack';

export default {
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

### Farm

```javascript
// farm.config.js
import ConditionalCode from 'code-sifter/farm';

export default {
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

## ESLint Support

CodeSifter includes an ESLint plugin to prevent false positives in conditional code blocks:

```javascript
// .eslintrc.js
module.exports = {
  // ...
  plugins: ['code-sifter'],
  processor: 'code-sifter/processor'
};
```

## Advanced Usage

For more advanced usage and API details, check out the examples in the playground directory:
- [Webpack example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/webpack-example)
- [Rollup example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/rollup-example)
- [Vue example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/vue-example)

## API

### Options

- `conditions`: Object with condition name-value pairs
- `include`: glob-like to determine which files to process
- `excluds`: glob-like to exclude files

## License

MIT
