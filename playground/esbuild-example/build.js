import * as esbuild from 'esbuild'
import ConditionalCode from 'code-sifter/esbuild';

await esbuild.build(
  /** @type {import('esbuild').BuildOptions} */
  {
    entryPoints: ['src/app.jsx'],
    bundle: true,
    outfile: 'dist/index.js',
    plugins: [
      ConditionalCode({
        conditions: {
          IS_LINUX: true,
          IS_PRODUCTION: false,
        }
      }),
    ],
  }
);
