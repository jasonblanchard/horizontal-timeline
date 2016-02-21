/* eslint-disable */

var path = require('path');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style',
          'css',
          'autoprefixer?{"browsers":["> 5%","last 2 versions"]}',
          'sass?includePaths[]=./node_modules'
        ]
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
}
