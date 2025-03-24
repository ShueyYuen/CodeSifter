import { processCode, Conditions } from './core/process';
import type { Plugin } from 'rollup';

interface PluginOptions {
  conditions?: Conditions;
  sourcemap?: boolean;
}

/**
 * Create a Rollup plugin for conditional compilation
 * @param options - Plugin options including conditions and sourcemap settings
 * @returns Configured Rollup plugin
 */
function conditionalPlugin(options: PluginOptions = {}): Plugin {
  const pluginOptions = structuredClone(options);
  
  return {
    name: 'rollup-plugin-conditional',
    
    transform(code, id) {
      try {
        const result = processCode(code, {
          ...pluginOptions,
          filename: id,
        });
        
        return {
          code: result.code,
          map: result.sourceMap
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.error(`Conditional compilation error in ${id}: ${errorMessage}`);
      }
    }
  };
}

export default conditionalPlugin;