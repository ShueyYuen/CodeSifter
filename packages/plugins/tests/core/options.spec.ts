import { resolveOptions } from '../../src/core/options.js';

describe('resolveOptions', () => {
  it('should resolve default options fulfiled', () => {
    const options = resolveOptions({});

    expect(options.include).toEqual([/\.[cm]?[jt]sx?$/, /\.(le|(s|p(ost)?)?c|sa)ss$/, /\.(vue|styl(us)?|postcss|pug|html)$/]);
    expect(options.exclude).toEqual([/node_modules/, /\.git/, /\.nuxt/]);
    expect(options.conditions).toEqual({});
    expect(options.sourcemap).toBe(true);
    expect(options.macroDefinitions).toEqual([]);
  });

  it('should resolve custom options', () => {
    const options = resolveOptions({
      include: /\.ts$/,
      exclude: /node_modules/,
      conditions: { IS_LINUX: true },
    });

    expect(options.include).toEqual(/\.ts$/);
    expect(options.exclude).toEqual(/node_modules/);
    expect(options.sourcemap).toBe(true);
    expect(options.conditions).toEqual({ IS_LINUX: true });
    expect(options.macroDefinitions).toEqual([
      { find: /\b__IS_LINUX__\b/g, replacement: 'true' },
    ]);
  });

  it('should validate condition keys as uppercase', () => {
    expect(() => resolveOptions({ conditions: { isLinux: true } }))
      .toThrow(/must be in UPPER_CASE/);

    expect(() => resolveOptions({ conditions: { IS_LINUX: true, isProduction: false } }))
      .toThrow(/isProduction/);

    expect(() => resolveOptions({ conditions: { IS_LINUX: true } }))
      .not.toThrow();

    expect(() => resolveOptions({ conditions: { 'IS-LINUX': true } }))
      .toThrow(/must be in UPPER_CASE/);
  });

  it('should generate macro definitions when conditions are provided', () => {
    const options = resolveOptions({ conditions: { IS_LINUX: true } });
    expect(options.macroDefinitions).toEqual([
      { find: /\b__IS_LINUX__\b/g, replacement: 'true' },
    ]);
  });
});
