/* #if IS_LINUX && IS_PRODUCTION */
import { createServer } from './create-linux-server';
console.log('Using Linux server (Rollup build)');
/* #else */
import { createServer } from './create-server';
console.log('Using default server (Rollup build)');
/* #endif */

const a = createServer({ 
  delay: /* #if IS_LINUX */ 600, /* #else */ 100, /* #endif */
  rollupBuild: true,
  /* #if IS_PRODUCTION */
  production: true,
  /* #endif */
});
