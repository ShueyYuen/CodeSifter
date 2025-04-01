const path = require('path');
const { CodeSifter } = require('code-sifter/vue-cli');

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  // Optional: Configure other Vue CLI settings
  configureWebpack: {
    plugins: [
      CodeSifter({
        conditions: {
          IS_LINUX: false,
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  },

  // Optional: Modify output directory and public path if needed
  // outputDir: 'dist',
  // publicPath: '/',

  // Optional: Enable source maps in production
  productionSourceMap: true,
};
