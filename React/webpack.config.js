const path = require('path')

const common = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'

        }

      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]'
            }
          }
        ]
      }
    ]

  }
}

module.exports = [

  {
    ...common,
    output: {
      path: path.join(__dirname, '../WebServer/src/public/bundles'),
      filename: 'bundle.js',
      publicPath: '/public/bundles/'
      // publicPath: "/"
    },
    entry: [path.join(__dirname, 'src', './main.js')],

    resolve: {
      alias: {
        

      }
    },

    plugins: []
  }
]
