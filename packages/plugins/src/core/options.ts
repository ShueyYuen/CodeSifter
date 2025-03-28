import type { FilterPattern } from 'unplugin-utils'

import type { Conditions } from './process.js';

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  conditions?: Conditions;
  useMacroDefination?: boolean;
}

export interface Replacer {
  find: RegExp;
  replacement: string;
}

type MustRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
}
export type ResolvedOptions = MustRequired<Omit<Options, 'useMacroDefination'>> & {
  sourcemap: boolean;
  macroDefinitions: Replacer[];
};

const UPPER_CASE = /^[A-Z_]+$/;

export function resolveOptions(options: Options): ResolvedOptions {
  const { include, exclude, conditions, useMacroDefination } = options;
  if (conditions) {
    for (const key in conditions) {
      if (!UPPER_CASE.test(key)) {
        throw new Error(`Condition key "${key}" must be in UPPER_CASE`);
      }
    }
  }

  return {
    include: include || [/\.[cm]?[jt]sx?$/, /\.(le|(s|p(ost)?)?c|sa)ss$/, /\.(vue|styl(us)?|postcss|pug|html)$/],
    exclude: exclude || [/node_modules/, /\.git/, /\.nuxt/],
    conditions: conditions || {},
    sourcemap: true,
    macroDefinitions: conditions && useMacroDefination !== false ? Object.keys(conditions).reduce<Replacer[]>((acc, key) => {
      acc.push({ find: new RegExp(`\\b__${key}__\\b`, 'g'), replacement: JSON.stringify(!!conditions[key]) });
      return acc;
    }, []) : [],
  };
}
