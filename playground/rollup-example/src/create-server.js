export function createServer(options) {
  console.log('Creating default server with options (Rollup):', options);
  return {
    type: 'default-rollup',
    options
  };
}
