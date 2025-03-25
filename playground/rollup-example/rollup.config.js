import { nodeResolve } from '@rollup/plugin-node-resolve';
import ConditionalCode from 'code-sifter/rollup';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    ConditionalCode({
      conditions: {
        IS_LINUX: process.env.IS_LINUX === 'true',
        IS_PRODUCTION: false
      }
    }),
    nodeResolve()
  ]
};
