const path2Regexp = require('path-to-regexp')
const MOCK_DATA_DIR = './'

const initMockRouterReg = function (map) {
  var regMap = new Map()
  for (var pathReg in map) {
    var keyArr = map[pathReg].split(/\s/)
    var pathInfo = {}, urlReg
    if (keyArr.length > 1) {
      urlReg = keyArr[1]
      pathInfo.method = keyArr[0].toLowerCase()
    } else {
      urlReg = keyArr[0]
    }
    pathInfo.mockFile = MOCK_DATA_DIR + map[pathReg]
    regMap.set(path2Regexp(urlReg), pathInfo)
  }
  return regMap  
}
var routeMap = {
  '/user/getUserInfo.do': '/user/getUserInfo.do',
  '/frontpage/uploadimg.do': '/frontpage/uploadimg.do',

  // 领券中心-begin
    // 导航模块
  '/couponcenter/getAllNavList.do': '/couponcenter/getAllNavList.do',
  'post /couponcenter/newOrUpdateNavItem.do': '/couponcenter/newOrUpdateNavItem.do',
  '/couponcenter/deleteNavItem.do': '/couponcenter/deleteNavItem.do',
  '/couponcenter/changeNavOrder.do': '/couponcenter/changeNavOrder.do',
    // 优惠券模块
  '/couponcenter/getCouponListByNavId.do': '/couponcenter/getCouponListByNavId.do',
  '/couponcenter/getCouponSimpleById.do': '/couponcenter/getCouponSimpleById.do',
  '/couponcenter/batchDeleteCouponItemByIds.do': '/couponcenter/batchDeleteCouponItemByIds.do',
  '/couponcenter/changeCouponOrder.do': '/couponcenter/changeCouponOrder.do',
  '/couponcenter/newOrUpdateCouponItemInfo.do': '/couponcenter/newOrUpdateCouponItemInfo.do',
  '/couponcenter/batchImportCoupon.do': '/couponcenter/batchImportCoupon.do',
  // 领券中心-end
  // proxy test
  '/_private/browser/stats': '/_private/browser/stats'
}
const pathRegMap = initMockRouterReg(routeMap)
module.exports = {
  getFilePath (requestPath, method, isXhr) {
    var filePath = false
    pathRegMap.forEach(function (pathInfo, urlReg) {
      var limitMethod = pathInfo.method
      if (urlReg.test(requestPath)) {
        filePath = pathInfo.mockFile
        if (limitMethod && limitMethod !== method && isXhr) {
          filePath = false
        }
      }
    })
    return filePath
  }
}
