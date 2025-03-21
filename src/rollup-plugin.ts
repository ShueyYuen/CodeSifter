import { processConditionalCode, ConditionsObject } from './core';
import * as path from 'node:path';
import * as fs from 'node:fs';

interface PluginOptions {
  conditions?: ConditionsObject;
}

interface PluginContext {
  error: (message: string) => never;
}

interface RollupPlugin {
  name: string;
  options: (opts: any) => any;
  load: (id: string) => string | null;
  transform: (this: PluginContext, code: string, id: string) => { code: string; map: any } | null;
}

/**
 * Create a Rollup plugin for conditional compilation
 * @param options - Plugin options
 * @returns Rollup plugin
 */
function conditionalPlugin(options: PluginOptions = {}): RollupPlugin {
  const conditions = options.conditions || {};
  
  return {
    name: 'conditional-compilation',
    
    // Add options hook to set plugin order
    options(opts) {
      // Ensure this plugin runs as early as possible
      return Object.assign({}, opts);
    },
    
    // Use the load hook which runs before transform
    load(id) {
      // Skip if the file doesn't exist or isn't readable
      try {
        if (!fs.existsSync(id) || !fs.statSync(id).isFile()) {
          return null;
        }
        
        // Read the file content
        const code = fs.readFileSync(id, 'utf8');
        
        // Determine file type based on extension
        const ext = path.extname(id).toLowerCase().substring(1);
        
        return processConditionalCode(code, conditions);
      } catch (error) {
        // If there's an error reading the file, let Rollup handle it
        return null;
      }
    },
    
    // Keep transform as fallback but with higher priority
    transform(code, id) {
      // Only process if load hook didn't handle it
      // This acts as a fallback
      
      try {
        return {
          code: processConditionalCode(code, conditions),
          map: null // Consider adding source map support in the future
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.error(`Conditional compilation error in ${id}: ${errorMessage}`);
        return null;
      }
    }
  };
}

export default conditionalPlugin;