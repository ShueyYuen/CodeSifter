import type { FilterPattern } from 'unplugin-utils'

import type { Conditions } from './process';

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  conditions?: Conditions;
}

export type ResolvedOptions = Required<Pick<Options, 'conditions' | 'exclude' | 'include'>> & Options;

export function resolveOptions(options: Options): ResolvedOptions {
  return {
    include: options.include || [/\.[cm]?[jt]sx?$/, /\.vue$/],
    exclude: options.exclude || [/node_modules/],
    conditions: options.conditions || {},
  };
}
