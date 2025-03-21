const webpackLoader = require('./src/webpack-loader');
const rollupPlugin = require('./src/rollup-plugin');
const { processConditionalCode } = require('./src/core');

module.exports = {
  // Core function
  processConditionalCode,
  
  // Webpack loader
  webpackLoader,
  
  // Rollup plugin
  rollupPlugin,
  
  // Default export as webpack loader for compatibility
  default: webpackLoader
};
