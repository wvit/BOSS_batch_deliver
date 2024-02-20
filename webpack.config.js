const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const copyFiles = [
  {
    from: path.resolve('src/assets/manifest.json'),
    to: `${path.resolve('dist')}/manifest.json`,
  },
  {
    from: path.resolve('src/assets/img/icon.png'),
    to: `${path.resolve('dist')}/img/icon.png`,
  },
]

module.exports = {
  mode: 'production',
  entry: {
    content: './src/content/index.ts',
    watchXHR: './src/content/watchXHR.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: pathData => {
      const { name } = pathData.chunk
      if (name === 'background') {
        return '[name].js'
      } else {
        return 'js/[name].js'
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({ patterns: copyFiles }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 102400,
          name: 'img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: { '@': path.join(__dirname, 'src') },
    mainFiles: ['index'],
  },
}
