import type { FilterPattern } from 'unplugin-utils'

import type { Conditions } from './process.js';

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  conditions?: Conditions;
}

type MustRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
}
export type ResolvedOptions = MustRequired<Options>;

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
    include: options.include || [/\.[cm]?[jt]sx?$/, /\.(le|(s|p(ost)?)?c|sa)ss$/, /\.(vue|styl(us)?|postcss|pug|html)$/],
    exclude: options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
    conditions: options.conditions || {},
  };
}
