const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const copyFiles = [
  {
    from: 'public',
    to: `${path.resolve('dist')}/`,
  },
]

module.exports = {
  cache: {
    type: 'filesystem',
  },

  entry: {
    action: './src/action/index.tsx',
    content: './src/content/index.ts',
    background: './src/background/index.ts',
    content_boss_watchXhr: './src/content/boss/watchXhr.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: chunkData => {
      const pathChain = chunkData.chunk.name.split('_')

      if (pathChain.length > 1) {
        return `./${pathChain.join('/')}.js`
      } else {
        return `./${pathChain[0]}/index.js`
      }
    },
  },

  plugins: [
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({ patterns: copyFiles }),

    new HtmlWebpackPlugin({
      template: './src/action/index.html',
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
              ['@babel/preset-env', { targets: { chrome: '73', node: '12' } }],
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
          name: '[name].[hash:8].[ext]',
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
