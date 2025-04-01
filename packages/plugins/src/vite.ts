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
 * import CodeSifter from 'code-sifter/vite';
 *
 * export default defineConfig({
 *   plugins: [CodeSifter()],
 * });
 */
const CodeSifter = ConditionalCode.vite as  typeof ConditionalCode.vite;
export { CodeSifter as default, CodeSifter };
