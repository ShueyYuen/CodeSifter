import { processCode, Conditions } from './core/process';
import { type LoaderDefinitionFunction } from 'webpack';

interface LoaderOptions {
  conditions?: Conditions;
}

/**
 * Webpack loader for conditional compilation
 * @param source - Source code to process
 * @returns Processed code with conditionals evaluated
 */
const conditionalLoader: LoaderDefinitionFunction<LoaderOptions> = function (source: string) {
  const options = this.getOptions() || {};
  const conditions = options.conditions || {};
  this.async();
  
  try {
    const { code, sourceMap } = processCode(source, {
      conditions,
      filename: this.resourcePath,
    });
    this.callback(null, code, sourceMap);
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error instanceof Error ? error.message : String(error)}`));
    return source;
  }
};

export default conditionalLoader;
