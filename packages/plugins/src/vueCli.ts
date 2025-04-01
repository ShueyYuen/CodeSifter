/**
 * This entry file is for Vue CLI Webpack plugin.
 *
 * @module
 */

import { createFilter } from 'unplugin-utils';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { type Options, resolveOptions } from "./core/options.js";
import { processCode } from './core/process.js';

import type { WebpackPluginInstance } from "webpack";

const NAME = 'vue-cli-plugin-code-sifter';

const CodeSifter = (rawOptions: Options = {}) => {
  const options = resolveOptions(rawOptions);
  const filter = createFilter(options.include, [options.exclude, /\.html$/].flat());

  return {
    name: NAME,
    apply(compiler) {
      compiler.hooks.compilation.tap(NAME, (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(NAME, (data, cb) => {
          const result = processCode(data.html, {
            ...options,
            sourcemap: false,
          });
          data.html = result ? result.code : data.html;
          cb(null, data);
        })
      });
      compiler.options.module.rules.unshift({
        enforce: 'pre',
        test: (id) => filter(id),
        loader: 'code-sifter/loader',
        options: rawOptions,
      });
    }
  } as WebpackPluginInstance
}

export { CodeSifter as default, CodeSifter };
