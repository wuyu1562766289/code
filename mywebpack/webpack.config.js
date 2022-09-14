const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './dist'),
    // 重新打包清理垃圾文件
    clean: true,

    // 打包静态资源输出目录及名称
    // assetModuleFilename: 'asset/img.png'
    // 自动命名 (ext：扩展名)
    assetModuleFilename: 'images/[contenthash][ext]'
  },

  // 打包模式
  mode: 'development',  // 开发模式

  // 启用source map
  devtool: 'inline-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 模板
      filename: 'test.html',  // 输出文件名
      inject: 'body'  // script标签注入位置
    })
  ],

  // 监听文件变化，自动刷新浏览器
  // 安装webpack-dev-server
  // 运行：npx webpack-dev-server --open
  devServer: {
    // 输出目录
    static: './dist'
  },

  // 资源加载
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/resource',
        // 打包文件输出目录及文件名，优先级高于out里面的配置
        generator: {
          filename: 'images/[contenthash][ext]'
        }
      }

    ]
  }
}