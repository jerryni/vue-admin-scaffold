import moment from 'moment'

export default {
  formatTime (time, format) {
    return moment(time).format(format || 'YYYY-MM-DD')
  },
  isIngredientCoupon (value) {
    return ['单张优惠券', '组合优惠券'][value || 0]
  },

  ifSendNewUser (value) {
    return ['全部用户', '限新客', '限老客'][value || 0]
  },

  showStatus (value) {
    return ['', '展示', '隐藏'][value || 1]
  },

  /*
    1. 如果是普通优惠券，且类型为“全额抵扣”，显示：全额抵扣
    2. 如果是普通优惠券，且类型为“满额减免”，显示：满额减免（满x元减y元）
    3. 如果是成分优惠券，且为主成分优惠券，不管是什么类型，都显示：/
   */
  couponType (value, coupon) {
    if (coupon.isIngredientCoupon === 0) {
      if (value === 2) {
        return '全额抵扣'
      } else {
        return `满额减免（满${coupon.threshold}元减${coupon.couponAmount}元）`
      }
    } else {
      return '/'
    }
  },
  linkType (value) {
    return ['', '充值中心', '商品详情页', '店铺', '品牌', '适用页'][value || 1]
  }
}
