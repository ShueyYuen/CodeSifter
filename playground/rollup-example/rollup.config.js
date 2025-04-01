import { nodeResolve } from '@rollup/plugin-node-resolve';
import CodeSifter from 'code-sifter/rollup';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: process.env.IS_LINUX === 'true',
        IS_PRODUCTION: false
      }
    }),
    nodeResolve()
  ]
};
