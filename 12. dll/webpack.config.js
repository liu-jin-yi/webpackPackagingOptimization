const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  // 模式
  mode: "production",
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build"),
    // 自定义输出 静态资源文件名(图片)
    assetModuleFilename: "assets/[hash][ext]",
  },
  // 模块
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/,
        // 使用loader对文件进行处理
        /**
         * use数组中的执行顺序是 从右到左  从下到上 依次执行
         * style-loader  创建style标签，将样式文件引入到header中
         * css-loader 将css模块变成commonjs模块加载到js中， 文件内容是样式字符串
         */
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          // 将less文件编译成css文件
          // 需要下载 less-loader和less
          "less-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // webpack 5 内置了资源类型，已经废弃了之前的 url-loader 和 file-loader
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        // 处理html中的图片文件 引入img文件进而让url-loader处理
        loader: "html-loader",
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  // 插件
  plugins: [
    // HtmlWebpackPlugin
    // 默认会创建一个空的html文件，会自动引入打包完成的所有资源。
    // 需要有结构的html文件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, "dll/manifest.json"),
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, "dll/dllFile.js"),
      outputPath: "dll", // 如果设置，将用作文件的输出目录。
      publicPath: "dll", // 如果设置，将用作脚本或链接标记的公共路径。
    }),
  ],
  /**
   * 下载 yarn add webpack-dev-server --dev
   * 运行  npx webpack serve
   */
  devServer: {
    // 项目构建后的路径
    contentBase: resolve(__dirname, "build"),
    // 自动打开浏览器
    open: true,
    // 端口号
    port: 5555,
    // 开启gzip压缩
    compress: true,
  },
};
