import { nodeResolve } from '@rollup/plugin-node-resolve';
import conditionalPlugin from 'conditional-loader/rollup';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    conditionalPlugin({
      conditions: {
        IS_LINUX: process.env.IS_LINUX === 'true',
        IS_PRODUCTION: false
      }
    }),
    nodeResolve()
  ]
};
