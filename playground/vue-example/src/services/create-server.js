/**
 * Create a standard server instance
 * @param {Object} options - Server configuration options
 * @returns {Object} Server instance
 */
export function createServer(options) {
  console.log('Creating standard server with options:', options);
  return {
    type: 'standard',
    options,
    version: '1.0.0'
  };
}