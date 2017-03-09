'use strict'

const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: './dist/index.js'
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: [
          "ts-loader"
        ]
      }
    ],
  },
  resolve: {
    extensions: ['', '.ts', '.tsx']
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: [
        'node generate-definitions.js'
      ]
    })
  ]
};