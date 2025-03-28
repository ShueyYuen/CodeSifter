const path = require('path');
const ConditionalCode = require('code-sifter/webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [ConditionalCode({
    conditions: {
      IS_LINUX: process.env.OS === 'Linux',
      IS_PRODUCTION: process.env.NODE_ENV === "production",
    },
  })],
};
