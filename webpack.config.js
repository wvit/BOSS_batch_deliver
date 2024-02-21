const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const copyFiles = [
  {
    from: './src/assets/manifest.json',
    to: `${path.resolve('dist')}/manifest.json`,
  },
  {
    from: './src/assets/img/icon.png',
    to: `${path.resolve('dist')}/img/icon.png`,
  },
]

module.exports = {
  mode: 'production',
  cache: {
    type: 'filesystem',
  },
  entry: {
    content: './src/content/index.ts',
    content_watchXHR: './src/content/watchXHR.ts',
    action: './src/action/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: chunkData => {
      const { name } = chunkData.chunk

      if (name === 'action') {
        return `./[name]/index.js`
      } else if (name.startsWith('content')) {
        const filename = name.split('_')[1] || 'index'
        return `./content/${filename}.js`
      }

      return '[name].js'
    },
  },
  plugins: [
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({ patterns: copyFiles }),

    new HtmlWebpackPlugin({
      template: './src/assets/template.html',
      filename: './action/index.html',
      inject: 'body',
      chunks: ['action'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },

      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 102400,
          name: 'img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: { '@': path.join(__dirname, 'src') },
    mainFiles: ['index'],
  },
}
