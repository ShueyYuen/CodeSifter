export function createServer(options) {
  console.log('Creating default server with options:', options);
  return {
    type: 'default',
    options
  };
}
