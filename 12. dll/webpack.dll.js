const { resolve } = require("path");
const webpack = require("webpack");

// webpack --config webpack.dll.js
module.exports = {
  entry: {
    // 最终打包生成的[name] --> dllFile
    // ['jquery',"lodash"] --> 要打包的库是jquery lodash
    dllFile: ["jquery", "lodash"],
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dll"),
    library: "[name]_[hash]", // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery lodash映射
    new webpack.DllPlugin({
      name: "[name]_[hash]", // 映射库的暴露的内容名称
      path: resolve(__dirname, "dll/manifest.json"), // 输出文件路径
    }),
  ],
  mode: "production",
};
