import webpackLoader from './webpack-loader';
import rollupPlugin from './rollup-plugin';
import { processConditionalCode } from './core';

// Export all utilities
export {
  // Core function
  processConditionalCode,
  
  // Webpack loader
  webpackLoader,
  
  // Rollup plugin
  rollupPlugin
};

// Default export as webpack loader for compatibility
export default webpackLoader;