import "./css/index.css";
import "./css/index.less";
console.log("打包");
/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包
*/
import(/* webpackChunkName: 'testTreeShaking' */ "./testTreeShaking").then(
  (res) => {
    console.log("res", res);
    res.test1();
  }
);
