const Path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  Path.resolve(__dirname, '../.env.production.local'),
  Path.resolve(__dirname, '../.env.production'),
  Path.resolve(__dirname, '../.env')
].filter(dotenvFile => fs.existsSync(dotenvFile));

console.log(dotenvFiles[0] + ' will be used.\n');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'assets/js/[name].[chunkhash:8].js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js'
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new Dotenv({ path: dotenvFiles[0] }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/bundle.css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: '../bundle-analyzer-plugin-report.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(
                  {
                    'browsers': ['>0.2%', 'last 2 versions', 'not dead', 'ie 10', 'ie 11']
                  }
                ),
                require('cssnano')(
                  {
                    preset: ['default', {
                      discardComments: {
                        removeAll: true,
                      },
                    }],
                  }
                )
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
});
