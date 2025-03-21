export function createServer(options) {
  console.log('Creating Linux server with options (Rollup):', options);
  /* #if !IS_PRODUCTION */
  console.log('Linux-specific behavior');
  /* #endif */
  return {
    type: 'linux-rollup',
    options,
    linuxSpecific: true
  };
}
