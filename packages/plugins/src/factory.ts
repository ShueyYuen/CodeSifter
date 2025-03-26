import { createUnplugin, type UnpluginInstance, type UnpluginOptions } from 'unplugin';
import { createFilter } from 'unplugin-utils'

import { processCode } from './core/process.js';
import { resolveOptions, type Options } from './core/options.js';

function preventUnpluginStupidMeta<T>(o: T): T {
  return Object.defineProperty(o, '__unpluginMeta', {
    get() {
      return {
        name: 'conditional-code',
        version: '1.0.0',
        framework: 'vue',
      };
    },
    set() {
      // do nothing
    },
    enumerable: false,
    configurable: false,
  });
}

export const ConditionalCode: UnpluginInstance<Options> = createUnplugin((rawOptions = {}) => {
  const options = resolveOptions(rawOptions);
  const macroDefinitions = Object.keys(options.conditions).reduce<Record<string, boolean>>((acc, key) => {
    acc[`__${key}__`] = !!options.conditions[key];
    return acc;
  }, {});

  const filter = createFilter(options.include, options.exclude);

  const processOptions = {
    conditions: options.conditions,
  }

  const name = 'conditional-code';
  return preventUnpluginStupidMeta<UnpluginOptions>({
    name,
    enforce: 'pre',

    transformInclude(id) {
      return filter(id);
    },

    transform(code) {
      return processCode(code, processOptions);
    },

    vite: {
      config() {
        return {
          define: macroDefinitions,
        }
      }
    },

    rollup: {
      options(rollupOptions) {
        return {
          ...rollupOptions,
          define: macroDefinitions
        };
      }
    },

    webpack(compiler) {
      const macroDefinitionPlugin = new compiler.webpack.DefinePlugin(macroDefinitions);
      macroDefinitionPlugin.apply(compiler);
    },

    rspack(compiler) {
      const macroDefinitionPlugin = new compiler.rspack.DefinePlugin(macroDefinitions);
      macroDefinitionPlugin.apply(compiler);
    },
  });
});
