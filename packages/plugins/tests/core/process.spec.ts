import { resolveOptions } from '../../src/core/options.js';
import { processCode } from '../../src/core/process.js';

const simpleOptions = resolveOptions({ conditions: { IS_LINUX: true } });

describe('processCode', () => {
  it('should process conditional directives correctly', () => {
    const code = `
      /* #if IS_LINUX */
      console.log('Linux');
      /* #if !IS_LINUX */
      console.log('Not linux');
      /* #endif */
      /* #else */
      console.log('Other');
      /* #endif */
    `;
    const result = processCode(code, simpleOptions);

    expect(result!.code).toBe(`
      console.log('Linux');
    `);
    expect(result!.map).toBeDefined();
  });

  it('should process #ifdef correctly', () => {
    const code = `
      /* #ifdef IS_LINUX */
      console.log('Linux');
      /* #else */
      console.log('Other');
      /* #endif */
    `;
    const result = processCode(code, simpleOptions);

    expect(result!.code).toBe(`
      console.log('Linux');
    `);
    expect(result!.map).toBeDefined();
  });

  it('should process #ifndef correctly', () => {
    const code = `
      /* #ifndef IS_LINUX */
      console.log('Linux');
      /* #else */
      console.log('Other');
      /* #endif */
    `;
    const result = processCode(code);

    expect(result!.code).toBe(`
      console.log('Linux');
    `);
    expect(result!.map).toBeDefined();
  });

  it('should use options.useMacroDefination', () => {
    const code = `
    createServer({
      /* #if IS_LINUX */
      paral: __IS_HIGHPERFORMANCE_DEVICE__ ? 1000 : 10,
      /* #endif */
    });
    `;

    const options = resolveOptions({
      conditions: {
        IS_LINUX: true,
        IS_HIGHPERFORMANCE_DEVICE: true,
      },
      useMacroDefination: true,
    });
    const result = processCode(code, options);
    expect(result!.code).toBe(`
    createServer({
      paral: true ? 1000 : 10,
    });
    `)
  });

  it('should work within css correctly', () => {
    const code = `
    /* #if IS_LINUX */
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    /* #else */
    .text {
      color: red;
    }
    /* #endif */
    `;
    const result = processCode(code, simpleOptions);

    expect(result!.code).toBe(`
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    `);
  });

  it('should treat empty condition as false', () => {
    const code = `
    /* #if */
    console.log('Linux');
    /* #else */
    console.log('Other');
    /* #endif */
    `;
    const result = processCode(code);
    expect(result!.code).toBe(`
    console.log('Other');
    `);
    expect(result!.map).toBeDefined();
  })

  it('should work width complex directives', () => {
    const code = `
    createServer({
      /* #if IS_LINUX && IS_HIGHPERFORMANCE_DEVICE */
      paral: 1000,
      /* #endif */
    });
    `;
    const options = resolveOptions({
      conditions: {
        IS_LINUX: true,
        IS_HIGHPERFORMANCE_DEVICE: true,
      }
    });
    const result = processCode(code, options);
    expect(result!.code).toBe(`
    createServer({
      paral: 1000,
    });
    `)
  });

  it('should handle unmatched directives gracefully', () => {
    const code = `
      /* #if IS_LINUX */
      console.log('Linux');
    `;
    expect(() => processCode(code, simpleOptions)).toThrow(/Unclosed conditional block/);
  });

  it('should handle mismatched directive gracefully', () => {
    const code = `
      /* #else */
      console.log('linux');
    `;
    expect(() => processCode(code, simpleOptions)).toThrow(/without matching #if/);
  });

  it('should handle mismatched directive gracefully 2', () => {
    const code = `
      /* #if IS_LINUX */
      console.log('linux')
      /* #else */
      console.log('Other');
      /* #else */
    `;
    expect(() => processCode(code, simpleOptions)).toThrow(/Unexpected #else after #else/);
  });

  it('should handle unevaluable directive condition gracefully', () => {
    const code = `
      /* #if IS_LINUX === true */
      console.log('linux')
      /* #else */
      console.log('Other');
      /* #endif */
    `;
    expect(() => processCode(code, simpleOptions)).toThrow(SyntaxError);
  });

  it('should return null if no changes are made', () => {
    const code = `console.log('No directives here');`;
    const result = processCode(code);
    expect(result).toBeNull();
  });
});
