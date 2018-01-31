## vue-admin-scaffold

一个非常完整的后台管理系统脚手架

## 技术架构

- 使用[vue-cli](https://github.com/vuejs/vue-cli)脚手架，vue2.0
- ui框架用的是[element-ui](http://element.eleme.io/#/zh-CN/component/message)，也是[awesome-vue](https://github.com/vuejs/awesome-vue)里推荐的
- api请求 基于[axios](https://github.com/mzabriskie/axios)，再自己封装了一层
- 路由使用[vue-router](https://router.vuejs.org/zh-cn/)； 
- mock，proxy：基于express的自定义中间件mock + 基于[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)代理
- css: [postcss-salad](http://elemefe.github.io/postcss-salad/index)，可以很方便高效地写css
- 样式参考：https://github.com/taylorchen709/vue-admin

## 使用方法 Usage

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# proxy: config/index.js proxyTable
npm run dev test

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
