/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import CodeSifter from 'code-sifter/rollup';
 *
 * export default {
 *   plugins: [CodeSifter()],
 * };
 * ```
 */
const CodeSifter = ConditionalCode.rollup as  typeof ConditionalCode.rollup;
export { CodeSifter as default, CodeSifter };
