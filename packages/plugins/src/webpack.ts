/**
 * This entry file is for Webpack plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * import CodeSifter from 'code-sifter/webpack';
 *
 * export default {
 *   plugins: [CodeSifter()],
 * };
 */
const CodeSifter = ConditionalCode.webpack as  typeof ConditionalCode.webpack;
export { CodeSifter as default, CodeSifter };
