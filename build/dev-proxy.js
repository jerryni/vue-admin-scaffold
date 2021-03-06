const fs = require('fs')
const path = require('path')
const isIp = require('is-ip')
const chalk = require('chalk')
const isUrl = require('is-url')
const config = require('../config')
const urlParse = require('url-parse')
const proxyMiddleware = require('http-proxy-middleware')
const getFilePath = require('../mock/mockRouterMap').getFilePath

const initProxyMiddleware = function (toProxyAddress) {
  const proxyTable = config.dev.proxyTable

  var filter = function (pathname) {
    return !!getFilePath(pathname)
  };

  toProxyAddress = proxyTable[toProxyAddress] || toProxyAddress;

  if(!isUrl(toProxyAddress)){
    var urlObj = urlParse(`http://${toProxyAddress}`)
    if(!isIp(urlObj.hostname)){
      return function(){
        console.log('')
        console.log(chalk.yellow(`代理地址：${toProxyAddress} 错误`))
        console.log('')
      }
    }
    toProxyAddress = urlObj.href
  }
  function onProxyRes(proxyRes, req, res) {
  }
  function onProxyReq(proxyReq, req, res) {
  }

  return proxyMiddleware(filter, {
    target: toProxyAddress,
    changeOrigin: true,
    onProxyRes: onProxyRes,
    onProxyReq: onProxyReq
  })
}
module.exports = function() {
  const processArgv = process.argv.slice(2)
  if (!processArgv.length || processArgv[0] === 'mock') {
    return require('../mock')
  } else {
    return initProxyMiddleware(processArgv[0])
  }
}
