import { ConditionalCode } from "./factory.js";

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import ConditionalCode from 'code-sifter/rolldown';
 *
 * export default {
 *  plugins: [ConditionalCode()],
 * };
 * ```
 */
const rolldown = ConditionalCode.rolldown as  typeof ConditionalCode.rolldown;
export default rolldown;
export { rolldown as 'module.exports'}
