import { ConditionalCode } from ".";

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import ConditionalCode from 'code-sifter/rollup';
 *
 * export default {
 *   plugins: [ConditionalCode()],
 * };
 * ```
 */
const rollup = ConditionalCode.rollup as  typeof ConditionalCode.rollup;
export default rollup;
export { rollup as 'module.exports'}
