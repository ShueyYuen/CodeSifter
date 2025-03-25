/* #if !IS_LINUX */
import { createServer } from './create-linux-server';
/* #if IS_PRODUCTION */
console.log('Using Linux server (Rollup build)');
/* #endif */
/* #else */
import { createServer } from './create-server';
console.log('Using default server (Rollup build)');
/* #endif */

const a = createServer({ 
  delay: /* #if IS_LINUX */ 600, /* #else */ 100, /* #endif */
  rollupBuild: true,
  /* #if !IS_PRODUCTION */
  production: false,
  /* #endif */
});
