import { processConditionalCode, Conditions } from './core/process';

import type { Plugin } from 'rollup';

interface PluginOptions {
  conditions?: Conditions;
  sourcemap?: boolean;
}

/**
 * Create a Rollup plugin for conditional compilation
 * @param options - Plugin options
 * @returns Rollup plugin
 */
function conditionalCompilationPlugin(options: PluginOptions = {}): Plugin {
  const innerOptions = structuredClone(options);
  
  return {
    name: 'rollup-plugin-code-sifter',

    // Keep transform as fallback but with higher priority
    transform(code, id) {
      try {
        const result = processConditionalCode(code, {
          ...innerOptions,
          filename: id,
        });
        return {
          code: result.code,
          map: result.sourceMap // Consider adding source map support in the future
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.error(`Conditional compilation error in ${id}: ${errorMessage}`);
      }
    }
  };
}

export default conditionalCompilationPlugin;