const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    filename: 'sketch.js',
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'var',
    library: ['_sketch', 'assistants', pkg.name],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new webpack.DefinePlugin({
      window: {},
    }),
  ],
}
