const { processConditionalCode } = require('./core');
const path = require('path');

/**
 * Webpack loader for conditional compilation
 * @param {string} source - Source code
 * @returns {string} Processed code
 */
function conditionalLoader(source) {
  const options = this.getOptions() || {};
  const conditions = options.conditions || {};

  try {
    if (this.resourcePath.endsWith('.vue')) {
      // Vue files are processed differently
      console.log('\n', this.resourcePath, '\n*************\n', source, '\n-----------------\n', processConditionalCode(source, conditions), '\n~~~~~~~~~~~~~~~~~~~\n');
    }
    return processConditionalCode(source, conditions, this.resourcePath.endsWith('.vue'));
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error.message}`));
    return source;
  }
}

module.exports = conditionalLoader;
