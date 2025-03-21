const path = require('path');

module.exports = {
  chainWebpack: config => {
    // Get the IS_LINUX environment variable to use in loader configuration
    const isLinux = process.env.IS_LINUX === 'true';
    console.log('IS_LINUX:', isLinux);
    
    // Add code-sifter to process JS files
    config.module
      .rule('js')
      .use('code-sifter')
      .loader(require.resolve('code-sifter/webpack'))
      .options({
        conditions: {
          IS_LINUX: isLinux,
          IS_PRODUCTION: process.env.NODE_ENV === 'production'
        }
      })
      .before('babel-loader');
    
    // Add code-sifter to process Vue files
    config.module
      .rule('vue')
      .use('code-sifter')
      .loader(require.resolve('code-sifter/webpack'))
      .options({
        conditions: {
          IS_LINUX: isLinux,
          IS_PRODUCTION: process.env.NODE_ENV === 'production'
        }
      })
      .before('vue-loader');
    
    // Add code-sifter to process CSS files
    ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'].forEach(rule => {
      if (config.module.rules.get(rule)) {
        config.module
          .rule(rule)
          .oneOf('normal')
          .use('code-sifter')
          .loader(require.resolve('code-sifter/webpack'))
          .options({
            conditions: {
              IS_LINUX: isLinux,
              IS_PRODUCTION: process.env.NODE_ENV === 'production'
            }
          })
          .before('css-loader');
      }
    });
  },
  
  // Optional: Configure other Vue CLI settings
  configureWebpack: {
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