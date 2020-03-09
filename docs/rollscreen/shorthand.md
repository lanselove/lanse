### 移动端部分浏览器 scrolltop 失效
小米浏览器失效，但X浏览器没问题。浏览器类型都是Chrome(但内核版本不同)，渲染模式都是CSS1Compat(标准模式)
之前看到资料说一般在BackCompat(混杂模式)下 scrolltop 才会只对 body 生效啊，难道真是内核版本不同导致的？......反正，兼容代码写全套就是了

#### 阅读资料
scrollTop()的兼容性问题
https://blog.csdn.net/bluelotos893/article/details/80663190

document.compatMode查看当前文档的渲染模式
https://blog.csdn.net/yihanzhi/article/details/82664339

JS 获得浏览器类型和版本
https://segmentfault.com/a/1190000007640795
https://yq.aliyun.com/articles/332150

详细判断浏览器运行环境
https://juejin.im/post/5d0220a8f265da1bcc193c6c
https://github.com/JowayYoung/juejin-code/blob/master/browser-type.js

