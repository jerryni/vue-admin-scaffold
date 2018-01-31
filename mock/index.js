const fs = require('fs')
const path = require('path')
const stripJsonComments = require('strip-json-comments')

const resolveMockDataPath = function (mockDir, filePath) {
  if (filePath.indexOf('/') === 0) {
    filePath = filePath.slice(1, filePath.length)
  }
  return path.resolve(mockDir, filePath)
}

const readFile = function (extname) {
  extname = extname || '.json'
  return function (filePath) {
    filePath += extname
    var exists = fs.existsSync(filePath)
    if (exists) {
      return fs.readFileSync(filePath, 'UTF-8')
    } else {
      return exists
    }
  }
}

const readJSONFile = readFile()
const readMockData = function (filePath) {
  return readJSONFile(filePath)
}
const mockDir = path.resolve(__dirname, '../mock')

const getFilePath = require('./mockRouterMap').getFilePath

const initMockMiddleware = function (request, response, next) {
  const requestPath = request.path
  const method = request.method.toLowerCase()
  var mockDataPath = getFilePath(requestPath, method, request.xhr)
  if (mockDataPath) {
    var content = readMockData(resolveMockDataPath(mockDir, mockDataPath))

    // 加入图片的接口的返回
    if (/<script>/.test(content)) {
      response.status(200).send(content)
      next()
      return
    }

    if (content) {
      response.status(200).json(
        JSON.parse(stripJsonComments(content))
      )
    } else {
      const NO_FOUND_CODE = 404
      response.json(NO_FOUND_CODE, {
        code: NO_FOUND_CODE,
        msg: '接口数据未定义'
      })
    }
  } else {
    next()
  }
}
module.exports = initMockMiddleware
