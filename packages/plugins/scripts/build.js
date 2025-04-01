import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as cp from 'child_process';

const EXTERNAL = ['unplugin', 'unplugin-utils', 'html-webpack-plugin', 'magic-string'];

const ESBUILD_OPTIONS = {
  bundle: true,
  platform: 'node',
  sourcemap: true,
  external: EXTERNAL
}

function build(entryPoints) {
  esbuild.build({
    ...ESBUILD_OPTIONS,
    entryPoints,
    outdir: 'dist/cjs',
    format: 'cjs',
    outExtension: {'.js': '.cjs'},
  }).catch(() => process.exit(1));
  esbuild.build({
    ...ESBUILD_OPTIONS,
    entryPoints,
    outdir: 'dist/esm',
    format: 'esm',
    outExtension: {'.js': '.mjs'},
  }).catch(() => process.exit(1));
}

const entryPoints = [];
fs.readdirSync('./src', {recursive: true}).forEach((file) => {
  if (!file.endsWith('.ts')) {
    return;
  }
  entryPoints.push(`./src/${file}`);
});

build(entryPoints);

cp.execSync('pnpm build:types', {stdio: 'inherit'});
