/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import CodeSifter from 'code-sifter/farm';
 *
 *
 * export default {
 *  plugins: [CodeSifter()],
 * };
 * ```
 */
const CodeSifter = ConditionalCode.farm as  typeof ConditionalCode.farm;
export { CodeSifter as default, CodeSifter };
