/**
 * 1. 创建服务器 来体验缓存
 * yarn add express
 *
 *
 *
 */

const express = require("express");

const server = express();

// 缓存一个小时
server.use(express.static("build", { maxAge: 1000 * 3600 }));

server.listen(5555);
