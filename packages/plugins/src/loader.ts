import { processCode, Conditions } from './core/process.js';

import type { LoaderDefinitionFunction } from 'webpack';

interface LoaderOptions {
  conditions?: Conditions;
}

/**
 * Webpack loader for conditional compilation
 * @param source - Source code
 * @returns Processed code
 */
const codeSifter: LoaderDefinitionFunction<LoaderOptions> = function (source: string) {
  const options = this.getOptions() || {};
  const conditions = options.conditions || {};
  this.async();
  try {
    const { code, map } = processCode(source, {
      conditions,
      filename: this.resourcePath,
    });
    this.callback(null, code, map);
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error instanceof Error ? error.message : String(error)}`));
    return source;
  }
};

export default codeSifter;
