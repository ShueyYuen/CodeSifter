import { ConditionalCode } from "./factory.js";

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import ConditionalCode from 'code-sifter/farm';
 *
 *
 * export default {
 *  plugins: [ConditionalCode()],
 * };
 * ```
 */
const farm = ConditionalCode.farm as  typeof ConditionalCode.farm;
export default farm;
export { farm as 'module.exports'}
