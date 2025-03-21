import { processConditionalCode, Conditions } from './core/process';

interface LoaderOptions {
  conditions?: Conditions;
}

interface LoaderContext {
  getOptions(): LoaderOptions;
  resourcePath: string;
  emitError(error: Error): void;
}

/**
 * Webpack loader for conditional compilation
 * @param source - Source code
 * @returns Processed code
 */
function codeSifter(this: LoaderContext, source: string): string {
  const options = this.getOptions() || {};
  const conditions = options.conditions || {};
  try {
    if (this.resourcePath.endsWith('.vue')) {
      // Vue files are processed differently
      console.log('\n', this.resourcePath, '\n*************\n', source, '\n-----------------\n', processConditionalCode(source, conditions), '\n~~~~~~~~~~~~~~~~~~~\n');
    }
    return processConditionalCode(source, {
      conditions,
      filename: this.resourcePath,
    }).code;
  } catch (error) {
    this.emitError(new Error(`Conditional compilation error in ${this.resourcePath}: ${error instanceof Error ? error.message : String(error)}`));
    return source;
  }
}

export default codeSifter;