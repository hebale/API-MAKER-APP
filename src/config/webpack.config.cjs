const os = require('os');
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfig = (() => {
  dotenv.config({ path: path.join(process.cwd(), '.env') });

  process.env.HOST =
    process.env.HOST ||
    (() => {
      const interfaces = os.networkInterfaces();

      for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
          let alias = iface[i];
          if (
            alias.family === 'IPv4' &&
            alias.address !== '127.0.0.1' &&
            !alias.internal
          )
            return alias.address;
        }
      }
      return '0.0.0.0';
    })();

  return {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
      filename: './assets/script.min.js',
      path: path.join(process.cwd(), './public'),
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      alias: {
        '~': path.resolve(__dirname, '../../src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?/,
          loader: 'esbuild-loader',
          options: {
            target: 'es2015',
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../../',
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(process.cwd(), './index.html'),
        minify: false,
      }),
      new MiniCssExtractPlugin({ filename: './assets/style.min.css' }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-repost.html',
        openAnalyzer: false,
        excludeAssets: [/node_modules/],
      }),
    ],
  };
})();

module.exports = webpackConfig;
