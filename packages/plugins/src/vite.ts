/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.js
 * import ConditionalCode from 'code-sifter/vite';
 *
 * export default defineConfig({
 *   plugins: [ConditionalCode()],
 * });
 */
const vite = ConditionalCode.vite as  typeof ConditionalCode.vite;
export default vite;
export { vite as 'module.exports'}
