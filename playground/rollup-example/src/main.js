/* eslint-disable no-redeclare */
/* #if !IS_LINUX */
import { createServer } from './create-linux-server';
/* #if IS_PRODUCTION */
console.log('Using Linux server (Rollup build)');
/* #endif */
/* #else */
import { createServer } from './create-server';
console.log('Using default server (Rollup build)');
/* #endif */

const server = createServer({
  delay: __IS_LINUX__ ? 600 : 100,
  rollupBuild: true,
  /* #if !IS_PRODUCTION */
  production: false,
  /* #endif */
});
console.log('Server created:', server);
