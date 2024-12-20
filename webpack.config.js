const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
// const publicPath = ''
const publicPath = './'

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  externals: {
      'AMap': 'AMap',
      'AMapUI':'AMapUI'
    },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
	      test: /\.js$/,
        loader: 'babel-loader',
        options: {
			plugins:['syntax-dynamic-import']
         // presets: ['es2015']
        },
       /* include: [resolve('src')] */
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            // limit: 10000
            limit:1
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
      },
      '/d3/': {
        target: 'http://47.94.10.119:20007',
        changeOrigin: true,
        pathRewrite: {
          '^/d3': ''
        },
      },
      '/back/': {
        target: 'http://10.112.221.232:20006',
        changeOrigin: true,
        pathRewrite: {  
          '^/back': ''
        },
      },
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
