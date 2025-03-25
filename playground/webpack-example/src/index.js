/* #if IS_LINUX */
import { createServer } from './create-linux-server';
console.log('Using Linux server');
/* #else */
import { createServer } from './create-server';
console.log('Using default server');
/* #endif */

const a = createServer({
  delay: /* #if IS_LINUX */ 600, /* #else */ 100, /* #endif */
  /* #if IS_PRODUCTION */
  production: true,
  caching: true,
  /* #endif */
});
