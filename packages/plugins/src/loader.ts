import { type Options, resolveOptions } from './core/options.js';
import { processCode } from './core/process.js';

import type { LoaderDefinitionFunction } from 'webpack';

type LoaderOptions = Omit<Options, 'include' | 'exclude'>;

/**
 * Webpack loader for conditional compilation
 * @param source - Source code
 * @returns Processed code
 */
const codeSifter: LoaderDefinitionFunction<LoaderOptions> = function (source: string) {
  const options = resolveOptions(this.getOptions() || {});
  try {
    const result = processCode(source, {
      ...options,
      sourcemap: this.sourceMap !== false,
    });
    if (result) {
      this.callback(null, result.code, result.map);
    } else {
      this.callback(null, source);
    }
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error instanceof Error ? error.message : String(error)}`));
  }
};

export default codeSifter;
