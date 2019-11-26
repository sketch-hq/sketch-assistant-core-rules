const path = require('path')
const webpack = require('webpack')
const externals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  externals: [externals()],
  mode: 'production',
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.test.ts$/],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'dist/cjs'),
    libraryTarget: 'commonjs',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SKETCH_LINT_ENV': JSON.stringify('node'),
    }),
  ],
}
