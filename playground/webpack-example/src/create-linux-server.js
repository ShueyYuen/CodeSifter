export function createServer(options) {
  console.log('Creating Linux server with options:', options);
  return {
    type: 'linux',
    options,
    linuxSpecific: true
  };
}
