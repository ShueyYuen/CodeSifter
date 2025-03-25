import { ConditionalCode } from ".";

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * import ConditionalCode from 'code-sifter/webpack';
 *
 * export default {
 *   plugins: [ConditionalCode()],
 * };
 */
const webpack = ConditionalCode.webpack as  typeof ConditionalCode.webpack;
export default webpack;
export { webpack as 'module.exports'}
