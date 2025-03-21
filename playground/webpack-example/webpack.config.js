const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|html|css)$/,
        use: [
          {
            loader: 'conditional-loader/webpack',
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
