# Conditional Loader Playground

This playground contains three example projects that demonstrate how to use the conditional-loader plugin with webpack, rollup, and Vue.js.

## Webpack Example

A simple example showing how to use conditional-loader with webpack.

### Usage

```bash
cd webpack-example

# Install dependencies
npm install

# Build with default conditions (IS_LINUX=false)
npm run build

# Build with IS_LINUX=true
npm run build:linux
```

After building, open `index.html` in your browser to see the result.

## Rollup Example

A similar example showing how to use conditional-loader with rollup.

### Usage

```bash
cd rollup-example

# Install dependencies
npm install

# Build with default conditions (IS_LINUX=false)
npm run build

# Build with IS_LINUX=true
npm run build:linux
```

After building, open `index.html` in your browser to see the result.

## Vue Example

A Vue.js application example showing how to use conditional-loader with Vue.

### Usage

```bash
cd vue-example

# Install dependencies
npm install

# Run development server with default conditions (IS_LINUX=false)
npm run serve

# Build with default conditions (IS_LINUX=false)
npm run build

# Build with IS_LINUX=true
npm run build:linux
```

After building, the output will be in the `dist` folder. You can serve this with any static file server.

## What to Look For

1. Check the generated bundles in the `dist` folders of each example
2. Notice how code blocks are conditionally included/excluded based on the IS_LINUX flag
3. Try modifying the conditions or adding new conditional blocks to see how they affect the output

```bash
# To run all examples:
npm install -g concurrently
concurrently "cd webpack-example && npm install && npm run build" "cd rollup-example && npm install && npm run build" "cd vue-example && npm install && npm run build"
```
