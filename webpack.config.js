var webpack = require('webpack');

module.exports = {
  entry: './src/js/main.js',
  output: { path: './assets/js/', filename: 'app.js'},
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /.js/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.jsx$/, loaders: ["jsx-loader", "babel"], exclude: /node_modules/ },
      { test: /\.css$/, loaders: ["style", "css"] }
    ]
  }
}
