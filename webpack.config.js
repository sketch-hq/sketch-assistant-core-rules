const path = require('path')
const webpack = require('webpack')
const babelConfig = require('./babel.sketch.config')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: [/node_modules/, /\.test.ts$/],
        loader: 'babel-loader',
        options: babelConfig,
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
    library: 'SketchHqSketchLintRulesetCore',
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
