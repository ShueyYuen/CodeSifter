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

    expect(result!.code).toContain("console.log('Linux');");
    expect(result!.code).not.toContain("console.log('Other');");
    expect(result!.code).not.toContain("console.log('Not linux');");
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

    expect(result!.code).toContain("console.log('Linux');");
    expect(result!.code).not.toContain("console.log('Other');");
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

    expect(result!.code).toContain("console.log('Linux');");
    expect(result!.code).not.toContain("console.log('Other');");
  });

  it('should work with css correctly', () => {
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
    `
    const result = processCode(code, simpleOptions);

    expect(result!.code).toContain(".logo");
    expect(result!.code).not.toContain(".text");
  })

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
    expect(() => processCode(code, simpleOptions)).toThrow(/Unexpected #/);
  });

  it('should return null if no changes are made', () => {
    const code = `console.log('No directives here');`;
    const result = processCode(code);
    expect(result).toBeNull();
  });
});
