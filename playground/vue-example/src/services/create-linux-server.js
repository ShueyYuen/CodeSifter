/**
 * Create a Linux-optimized server instance
 * @param {Object} options - Server configuration options
 * @returns {Object} Server instance
 */
export function createServer(options) {
  console.log('Creating Linux-optimized server with options:', options);
  return {
    type: 'linux-optimized',
    options,
    version: '1.2.0',
    linuxSpecific: true,
    performanceMode: 'high'
  };
}