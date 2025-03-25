import { createUnplugin, type UnpluginInstance, type UnpluginOptions } from 'unplugin';
import { createFilter } from 'unplugin-utils'

import { processCode } from './core/process.js';
import { resolveOptions, type Options } from './core/options.js';

export const ConditionalCode: UnpluginInstance<Options> = createUnplugin((rawOptions = {}): UnpluginOptions => {
  const options = resolveOptions(rawOptions);
  const filter = createFilter(options.include, options.exclude);

  const processOptions = {
    conditions: options.conditions,
  }

  const name = 'conditional-code';
  return {
    name,
    enforce: 'pre',

    transformInclude(id) {
      return filter(id);
    },

    transform(code) {
      return processCode(code, processOptions);
    }
  };
});
