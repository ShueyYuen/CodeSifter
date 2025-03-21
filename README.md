# CodeSifter

A plugin for webpack and rollup that provides conditional compilation based on comment directives.

## Installation

```bash
npm install code-sifter --save-dev
```

## Features

- Conditional code inclusion/exclusion using comment directives
- Supports multiple file types (JavaScript, HTML, CSS)
- Works with both webpack and rollup
- Simple configuration

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

## Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx|html|css)$/,
        use: [
          {
            loader: 'code-sifter',
            options: {
              conditions: {
                IS_LINUX: false,
                IS_PRODUCTION: process.env.NODE_ENV === 'production',
                // Add your conditions here
              }
            }
          }
        ]
      }
    ]
  }
};
```

## Rollup Configuration

```javascript
// rollup.config.js
import conditionalPlugin from 'code-sifter/rollup-plugin';

export default {
  // ...
  plugins: [
    conditionalPlugin({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        // Add your conditions here
      }
    }),
    // other plugins...
  ]
};
```

## API

### processConditionalCode(code, conditions, options)

The core function that processes code with conditional directives.

- `code` (string): Source code to process
- `conditions` (object): Condition flags, e.g. `{ IS_LINUX: false }`
- `options` (object): Additional options
  - `fileType`: Type of file ('js', 'html', 'css')

## License

MIT
