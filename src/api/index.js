import Ajax from './ajax'
import _ from '@/components/utils'
export default {
  getGlobalInfo () { // 获取全局信息
    return Ajax.get('/user/getUserInfo.do')
  },

  // 领券中心-begin
  couponCenterPublish () { // 获取领券中心导航列表
    return Ajax.get('/couponcenter/publish.do')
  },
    // 导航模块
  getAllNavList (params) { // 获取领券中心导航列表
    return Ajax.get('/couponcenter/getAllNavList.do?' + _.urlParams(params))
  },
  newOrUpdateNavItem (params) { // 新建或更新导航项
    return Ajax.post('/couponcenter/newOrUpdateNavItem.do', params)
  },
  deleteNavItem (params) { // 删除导航
    return Ajax.get('/couponcenter/deleteNavItem.do?' + _.urlParams(params))
  },
  changeNavOrder (params) { // 改变顺序
    return Ajax.get('/couponcenter/changeNavOrder.do?' + _.urlParams(params))
  },
    // 优惠券模块
  getCouponListByNavId (params) { // 根据导航项id获取优惠券列表
    return Ajax.get('/couponcenter/getCouponListByNavId.do?' + _.urlParams(params))
  },
  getCouponSimpleById (params) { // 根据优惠券方案ID获取优惠券信息
    return Ajax.get('/couponcenter/getCouponSimpleById.do?' + _.urlParams(params))
  },
  batchDeleteCouponItemByIds (params) { // 批量删除优惠券信息
    return Ajax.post('/couponcenter/batchDeleteCouponItemByIds.do', params)
  },
  changeCouponOrder (params) { // 改变优惠券项的顺序
    return Ajax.get('/couponcenter/changeCouponOrder.do?' + _.urlParams(params))
  },
  newOrUpdateCouponItemInfo (params) { // 新建或更新优惠券项信息
    return Ajax.post('/couponcenter/newOrUpdateCouponItemInfo.do?', params)
  },
  batchImportCoupon (params) { // 批量上传
    return Ajax.post('/couponcenter/batchImportCoupon.do', params)
  },
  proxyTest () {
    return Ajax.get('/_private/browser/stats')
  }
  // 领券中心-end
}
