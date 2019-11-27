const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'web', // As close as we can get to a target for JSC
  mode: 'production',
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.sketch.json',
            },
          },
        ],
        exclude: [/node_modules/, /\.test.ts$/],
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
    library: 'Foo',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new webpack.DefinePlugin({
      window: {},
      'process.env.SKETCH_LINT_ENV': JSON.stringify('sketch'),
    }),
  ],
}
