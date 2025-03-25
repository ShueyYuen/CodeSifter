import { ConditionalCode } from "./factory.js";

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * import ConditionalCode from 'code-sifter/rspack';
 *
 * export default {
 *   plugins: [ConditionalCode()],
 * };
 * ```
 */
const rspack = ConditionalCode.rspack as  typeof ConditionalCode.rspack;
export default rspack;
export { rspack as 'module.exports'}
