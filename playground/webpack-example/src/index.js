/* eslint-disable no-redeclare */
/* #if IS_LINUX */
import { createServer } from './create-linux-server';
console.log('Using Linux server');
/* #else */
import { createServer } from './create-server';
console.log('Using default server');
/* #endif */

const server = createServer({
  delay: __IS_LINUX__ ? 600 : 100,
  /* #if IS_PRODUCTION */
  production: true,
  caching: true,
  /* #endif */
});

console.log('Am I running in linux? ', __IS_LINUX__, server);
