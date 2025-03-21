import { processConditionalCode, Conditions } from './core/process';
import { type LoaderDefinitionFunction } from 'webpack';

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
    // if (this.resourcePath.endsWith('.vue')) {
    //   // Vue files are processed differently
    //   console.log('\n', this.resourcePath, '\n*************\n', source, '\n-----------------\n', processConditionalCode(source, conditions), '\n~~~~~~~~~~~~~~~~~~~\n');
    // }
    const { code, sourceMap } = processConditionalCode(source, {
      conditions,
      filename: this.resourcePath,
    });
    this.callback(null, code, sourceMap);
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error instanceof Error ? error.message : String(error)}`));
    return source;
  }
};

export default codeSifter;
