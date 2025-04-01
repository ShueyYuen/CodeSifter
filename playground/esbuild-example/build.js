import * as esbuild from 'esbuild'
import CodeSifter from 'code-sifter/esbuild';

await esbuild.build(
  /** @type {import('esbuild').BuildOptions} */
  {
    entryPoints: ['src/app.jsx'],
    bundle: true,
    outfile: 'dist/index.js',
    plugins: [
      CodeSifter({
        conditions: {
          IS_LINUX: true,
          IS_PRODUCTION: false,
        }
      }),
    ],
  }
);
