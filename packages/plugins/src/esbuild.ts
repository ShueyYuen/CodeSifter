import { ConditionalCode } from ".";

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild';
 * import ConditionalCode from 'code-sifter/esbuild';
 *
 * build({
 *   plugins: [ConditionalCode()],
 * });
 * ```
 */
const esbuild = ConditionalCode.esbuild as  typeof ConditionalCode.esbuild;
export default esbuild;
export { esbuild as 'module.exports'}
