const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/**
 *
 */
module.exports = {
  // 模式
  mode: "production",
  //  单入口
  // entry: "./src/index.js",
  // 多入口文件打包进行文件切割
  entry: {
    // 多入口：有一个入口，最终输出就有一个bundle
    index: "./src/index.js",
    test: "./src/testTreeShaking.js",
  },
  // 出口
  output: {
    filename: "[name].[contenthash:10].js",
    path: resolve(__dirname, "build"),
    // 自定义输出 静态资源文件名(图片)
    assetModuleFilename: "assets/[hash][ext]",
  },
  // 模块
  module: {
    rules: [
      // loader的配置
      {
        oneOf: [
          // 以下的loader只会执行匹配的文件一次。
          {
            test: /\.css$/,
            // 使用loader对文件进行处理
            /**
             * use数组中的执行顺序是 从右到左  从下到上 依次执行
             * style-loader  创建style标签，将样式文件引入到header中
             * css-loader 将css模块变成commonjs模块加载到js中， 文件内容是样式字符串
             */
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
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
          {
            test: /\.js/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
                // 开启babel缓存
                // 第二次构建时，会读取之前的缓存
                // 用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。
                cacheDirectory: true,
              },
            },
          },
        ],
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
    new MiniCssExtractPlugin({
      filename: "css/built.[contenthash:10].css",
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
    // open: true,
    // 端口号
    port: 5555,
    // 开启gzip压缩
    compress: true,
    // 新增---》 开启热更新
    // 模块热替换功能会在程序运行过程中，替换，添加或删除模块，而无需重新加载整个页面。
    hot: true,
  },
  // source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）
  devtool: "source-map",
};
