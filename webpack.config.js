'use strict'

module.exports = {
  entry: './index.ts',
  output: {
    filename: './index.js'
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
  }
};