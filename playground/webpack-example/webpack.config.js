const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|html|css)$/,
        use: [
          {
            loader: 'code-sifter/webpack',
            options: {
              conditions: {
                IS_LINUX: process.env.IS_LINUX === 'true',
                IS_PRODUCTION: false
              }
            }
          }
        ]
      }
    ]
  }
};
