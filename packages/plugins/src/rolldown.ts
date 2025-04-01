/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import CodeSifter from 'code-sifter/rolldown';
 *
 * export default {
 *  plugins: [CodeSifter()],
 * };
 * ```
 */
const CodeSifter = ConditionalCode.rolldown as  typeof ConditionalCode.rolldown;
export { CodeSifter as default, CodeSifter };
