import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CouponCenter from '@/modules/coupon-center/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/coupon-center/index/',
      component: Home,
      name: 'couponCenterIndex',
      children: [
          { path: '/coupon-center/index/:navId?', component: CouponCenter, name: 'couponCenter' }
      ]
    }
  ]
})
