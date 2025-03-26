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

const vueCliPlugin = (rawOptions: Options = {}) => {
  const options = resolveOptions(rawOptions);
  const filter = createFilter(options.include, [options.exclude, /\.html$/].flat());

  return <WebpackPluginInstance>{
    name: NAME,
    apply(compiler) {
      compiler.hooks.compilation.tap(NAME, (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(NAME, (data, cb) => {
          console.log('Processing HTML file:', data.outputName);
          const { code } = processCode(data.html, {
            conditions: options.conditions,
            filename: data.outputName,
            sourcemap: false,
          });
          data.html = code;
          cb(null, data);
        })
      });
      compiler.options.module.rules.unshift({
        enforce: 'pre',
        test: (id) => filter(id),
        loader: 'code-sifter/loader',
      })
    }
  }
}

export default vueCliPlugin;
export { vueCliPlugin as 'module.exports' }
