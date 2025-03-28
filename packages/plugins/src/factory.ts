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
  const hasDefinitions = Object.keys(options.conditions).length > 0;

  const filter = createFilter(options.include, options.exclude);

  const name = 'conditional-code';
  return preventUnpluginStupidMeta<UnpluginOptions>({
    name,
    enforce: 'pre',

    buildStart() {
      const { conditions } = options;
      const hasNonbooleanConditions = Object.values(conditions).some((condition) => typeof condition !== 'boolean');
      if (hasNonbooleanConditions) {
        console.warn(
          `[${name}] Warning: Non-boolean conditions detected. They will be converted to boolean by '!!'.`,
        );
      }
    },

    transformInclude(id) {
      if (!hasDefinitions) {
        return false;
      }
      return filter(id);
    },

    transform(code) {
      return processCode(code, options);
    },

    esbuild: {
      setup(build) {
        const needsSourceMap = build.initialOptions.sourcemap !== false;
        options.sourcemap = needsSourceMap;
      },
    },

    rollup: {
      outputOptions(outputOptions) {
        const needsSourceMap = outputOptions.sourcemap !== false;
        options.sourcemap = needsSourceMap;
      },
    },

    rspack(compiler) {
      options.sourcemap = compiler.options.devtool !== false;
    },

    vite: {
      configResolved(config) {
        options.sourcemap = config.command === 'build' ? !!config.build.sourcemap : true;
      },
    },

    webpack(compiler) {
      options.sourcemap = compiler.options.devtool !== false;
    },
  });
});
