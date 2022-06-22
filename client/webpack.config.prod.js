const config = require('./webpack.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  ...config,
  mode: 'production',
  plugins: [...(config.plugins || []), new CleanWebpackPlugin()],
};
