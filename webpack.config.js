const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './index',
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
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'dist/sketch'),
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
