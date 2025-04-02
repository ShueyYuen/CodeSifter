# CodeSifter

[![npm](https://img.shields.io/npm/v/code-sifter.svg)](https://npmjs.com/package/code-sifter)
[![Unit Test](https://github.com/ShueyYuen/CodeSifter/actions/workflows/unit-test.yml/badge.svg)](https://github.com/ShueyYuen/CodeSifter/actions/workflows/unit-test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ShueyYuen/CodeSifter/blob/main/LICENSE)

A powerful plugin for webpack, rollup, vite, and other bundlers that provides conditional compilation based on comment directives.

## Installation

```bash
npm install code-sifter --save-dev
```

## Features

- [x] Conditional code inclusion/exclusion using comment directives
- [x] Supports multiple file types (JavaScript, TypeScript, CSS, HTML, Vue, etc.)
- [x] Works with multiple bundlers (webpack, rollup, vite, esbuild, rspack, farm)
- [x] Source map support
- [x] ESLint integration

## Usage

CodeSifter processes special comment directives to include or exclude code based on conditions:

- `/* #if CONDITION */` - Start a conditional block
- `/* #ifdef CONDITION */` - Check if condition is defined
- `/* #ifndef CONDITION */` - Check if condition is not defined
- `/* #else */` - Alternative code
- `/* #endif */` - End a conditional block

For HTML files, use HTML comments: `<!-- #if CONDITION -->`, etc.

### Example

Source code:
```javascript
/* #if IS_LINUX && !IS_PRODUCTION */
import { createServer } from './create-linux-server';
/* #else */
import { createServer } from './create-server';
/* #endif */
const a = createServer({
  delay: /* #if IS_LINUX */ 600 /* #else */ 100 /* #endif */,
});
```

When processed with `{ IS_LINUX: false }`, becomes:
```javascript
import { createServer } from './create-server';
const a = createServer({ delay: 100, });
```

> [!CAUTION]
> While this plugin supports conditional code removal via comments, this approach doesn't conform to standard JavaScript/TypeScript syntax and may not be considered best practice. Consider using proper imports and exports with tree-shaking capabilities of modern bundlers for a more maintainable codebase.

```javascript
// Better approach
import { createLinuxServer } from './create-linux-server';
import { createDefaultServer } from './create-server';

const serverOption = { delay: __IS_LINUX__ ? 600 : 100 };
const server = __IS_LINUX__ && !__IS_PRODUCTION__
  ? createLinuxServer(serverOption)
  ·: createDefaultServer(serverOption);
```

When bundlers process this code with proper environment variables, unused imports and code branches will be automatically removed during tree-shaking, resulting in cleaner, more maintainable code.

## Configuration

<details>

<summary>Webpack</summary>

example: [playgroud/webpack-example/](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/webpack-example)

```javascript
// webpack.config.js
const CodeSifter = require('code-sifter/webpack');

module.exports = {
  // ...
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

</details>

<details>

<summary>Rollup</summary>

example: [playground/rollup-example/](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/rollup-example)

```javascript
// rollup.config.js
import CodeSifter from 'code-sifter/rollup';

export default {
  // ...
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

</details>

<details>

<summary>Vite</summary>

example: [playground/vite-example/](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/vite-example)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import CodeSifter from 'code-sifter/vite';

export default defineConfig({
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
});
```

</details>

<details>

<summary>Esbuild</summary>

example: [playground/esbuild-example/](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/esbuild-example)

```javascript
// esbuild.config.js
import { build } from 'esbuild';
import CodeSifter from 'code-sifter/esbuild';

build({
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ],
});
```

</details>

<details>

<summary>Rspack</summary>

example: [playground/rspack-example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/rspack-example)

```javascript
// rspack.config.js
import CodeSifter from 'code-sifter/rspack';

export default {
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

</details>

<details>

<summary>Farm</summary>

example: [playground/farm-example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/farm-example)

```javascript
// farm.config.js
import CodeSifter from 'code-sifter/farm';

export default {
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: false,
        IS_PRODUCTION: process.env.NODE_ENV === 'production'
      }
    })
  ]
};
```

</details>

<details>

<summary>VueCli</summary>

example: [playground/vue-example](https://github.com/ShueyYuen/CodeSifter/tree/main/playground/vue-example)

```javascript
// vue.config.js
const CodeSifter = require('code-sifter/vueCli');

module.exports = {
  // ...
  configureWebpack: {
    plugins: [
      CodeSifter({
        conditions: {
          IS_LINUX: false,
          IS_PRODUCTION: process.env.NODE_ENV === 'production'
        }
      }),
    ]
  }
};
```

</details>

## ESLint Support

CodeSifter includes an ESLint plugin to prevent false positives in conditional code blocks:

```javascript
// .eslintrc.js
module.exports = {
  // ...
  plugins: ['@code-sifter/eslint-plugin'],
  rules: {
    'code-sifter/balanced-conditional-directives': 'error'
  }
};
```

## Advanced Features

### Macro Definitions

CodeSifter can automatically replace macro-like symbols with their values:

```javascript
createServer({
  /* #if IS_LINUX */
  parallel: __IS_HIGHPERFORMANCE_DEVICE__ ? 1000 : 10,
  /* #endif */
});
```

With `useMacroDefination: true` and proper conditions, `__IS_HIGHPERFORMANCE_DEVICE__` will be replaced with its boolean value.

> [!IMPORTANT]
> ⚠️ **Avoid using common predefined macro names:** Do not use macro names like `PURE`, `INLINE`, `NOINLINE`, etc., as these are already widely used by JavaScript engines and bundlers for optimization purposes. Using these names may cause conflicts with other tools in your build pipeline.

### Conditional Expressions

Support for complex conditional expressions:

```javascript
/* #if IS_LINUX && IS_HIGHPERFORMANCE_DEVICE */
console.log('High performance Linux machine');
/* #endif */
```

## API

### Options

| Option               | Type                            | Description                                                                       |
| -------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `conditions`         | `Object`                        | Key-value pairs where keys are UPPER_CASE condition names and values are booleans |
| `include`            | `RegExp` \| `String` \| `Array` | Files to include (defaults to JS/TS/CSS/HTML/Vue files)                           |
| `exclude`            | `RegExp` \| `String` \| `Array` | Files to exclude (defaults to node_modules, .git, etc.)                           |
| `useMacroDefination` | `Boolean`                       | Whether to enable macro definition replacement                                    |
| `sourcemap`          | `Boolean`                       | Whether to generate source maps                                                   |

## VS Code Snippets

To improve your development experience with CodeSifter, you can use the VS Code snippets that provide shortcuts for commonly used conditional code patterns. Simply create a [`.vscode/code-sifter.code-snippets`](https://github.com/ShueyYuen/CodeSifter/blob/main/.vscode/code-sifter.code-snippets) file in your project.

After adding this file, you'll be able to use the following shortcuts:

- Type `#if` to insert a conditional block with `#if`, `#ifdef`, or `#ifndef`
- Type `#ie` to insert a conditional block with `#else` included
- Type `__?` to create a ternary expression with macro definitions
- Type `if__` to create an if statement with a macro condition
- Type `ie__` to create an if-else statement with a macro condition

You can customize these snippets by modifying the condition names or adding your own directives based on your project's needs.

## License

[MIT](https://github.com/ShueyYuen/CodeSifter/blob/main/LICENSE) License © 2025-PRESENT Shuey Yuen
