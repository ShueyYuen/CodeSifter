import type { FilterPattern } from 'unplugin-utils'

import type { Conditions } from './process.js';

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  conditions?: Conditions;
}

export type ResolvedOptions = Required<Pick<Options, 'conditions' | 'exclude' | 'include'>> & Options;

const UPPER_CASE = /^[A-Z_]+$/;

export function resolveOptions(options: Options): ResolvedOptions {
  if (options.conditions) {
    for (const key in options.conditions) {
      if (!UPPER_CASE.test(key)) {
        throw new Error(`Condition key "${key}" must be in UPPER_CASE`);
      }
    }
  }
  return {
    include: options.include || [/\.[cm]?[jt]sx?$/, /\.(?:le|(?:post)?c|sa)ss$/, /\.(?:vue|stylus|postcss)$/],
    exclude: options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
    conditions: options.conditions || {},
  };
}
