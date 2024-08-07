const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const webpack = require('webpack');
const fs = require('fs');
const name = pkg.name;
let plugins = [];

module.exports = (env = {}) => {
  if (env.production) {
    plugins = [
      new webpack.BannerPlugin(`${name} - ${pkg.version}`),
    ];
  } else {
    const index = 'index.html';
    const indexDev = '_' + index;
    plugins.push(new HtmlWebpackPlugin({
      template: fs.existsSync(indexDev) ? indexDev : index,
      inject: false
    }));
  }

  return {
    mode: env.production ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${name}.min.js`,
      library: name,
      libraryTarget: 'umd',
    },
    devtool: 'eval-source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/, // Exclude node_modules
        use: ['babel-loader']
      }]
    },
    externals: {
      'grapesjs': 'grapesjs',
      '@ckeditor/ckeditor5-build-inline': '@ckeditor/ckeditor5-build-inline'
    },
    plugins: plugins,
    optimization: {
      minimize: env.production,
    }
  };
}
