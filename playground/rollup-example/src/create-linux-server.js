export function createServer(options) {
  console.log('Creating Linux server with options (Rollup):', options);
  return {
    type: 'linux-rollup',
    options,
    linuxSpecific: true
  };
}
