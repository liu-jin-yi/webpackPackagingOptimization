/**
 * 创建服务器 检查缓存
 *
 */

const express = require("express");

const server = express();

// 缓存一个小时
server.use(express.static("build", { maxAge: 1000 * 3600 }));

server.listen(5555, () => {
  console.log("服务器启动成功！", "http://localhost:5555/");
});
