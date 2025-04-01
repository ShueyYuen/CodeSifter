/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * import CodeSifter from 'code-sifter/rspack';
 *
 * export default {
 *   plugins: [CodeSifter()],
 * };
 * ```
 */
const CodeSifter = ConditionalCode.rspack as  typeof ConditionalCode.rspack;
export { CodeSifter as default, CodeSifter };
