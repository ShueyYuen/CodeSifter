import { defineConfig } from '@farmfe/core';
import CodeSifter from 'code-sifter/farm';

export default defineConfig({
  compilation: {
    presetEnv: false,
    script: {
      plugins: [],
      target: 'es2022',
      parser: {
        tsConfig: {
          decorators: true,
          dts: false,
          noEarlyErrors: false,
          tsx: false
        }
      }
    }
  },
  plugins: [
    CodeSifter({
      conditions: {
        IS_LINUX: true,
        IS_PRODUCTION: false,
      },
    })
  ],
});
