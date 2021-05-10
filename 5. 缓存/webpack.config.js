const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/**
 *  mode: "production",
 * 1. js 缓存， 首先下载 yarn add babel-loader @babel/core @babel/preset-env --dev
 *  对 js 进行缓存
 *  babel缓存
      cacheDirectory: true
      --> 让第二次打包构建速度更快
  2. 文件资源缓存
  css 文件提取
  下载 yarn add mini-css-extract-plugin --dev
      hash: 每次wepack构建时会生成一个唯一的hash值。
        问题: 因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
      chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
        问题: js和css的hash值还是一样的
          因为css是在js中被引入的，所以同属于一个chunk
      contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样    
      --> 让代码上线运行缓存更好使用
 *
 *
 */
module.exports = {
  // 模式
  mode: "production",
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    filename: "built.[contenthash:10].js",
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
