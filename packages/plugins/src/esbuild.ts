/**
 * This entry file is for Esbuild plugin.
 *
 * @module
 */

import { ConditionalCode } from "./factory.js";

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild';
 * import CodeSifter from 'code-sifter/esbuild';
 *
 * build({
 *   plugins: [CodeSifter()],
 * });
 * ```
 */
const CodeSifter = ConditionalCode.esbuild as  typeof ConditionalCode.esbuild;
export { CodeSifter as default, CodeSifter };
