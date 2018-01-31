<template>
  <div class="content-wrapper">
    <el-row>
      <el-col :span="24" class="operation-bar">
        <el-button type="primary" @click="publish">发布</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5" class="nav-wrapper" :class="collapsed?'hide':''">
        <nav-list></nav-list>
      </el-col>
      <el-col :span="collapsed?24:19" class="list-wrapper">
        <i class="collapse-control"
            :class="collapsed?'el-icon-arrow-right collapsed':'el-icon-arrow-left'" 
            @click.prevent="collapse"></i>
        <coupon-list></coupon-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from 'api'
import NavList from './sub-module/nav-list'
import CouponList from './sub-module/coupon-list'
export default {
  name: 'CouponCenterList',
  components: {NavList, CouponList},
  data () {
    return {
      msg: 'Welcome coupon center list',
      collapsed: false
    }
  },
  created () {
  },
  methods: {
    collapse () {
      this.collapsed = !this.collapsed
    },
    publish () {
      api.couponCenterPublish().then(() => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-wrapper {
  position: relative;
  
  .operation-bar {
    padding: 15px;
    border-bottom: solid 1px #eee;
  }

  .nav-wrapper {
    position: relative;
    border-right: 1px solid #eee;
  }

  .list-wrapper {
    
    height: calc(100vh - 127px); /* 减去上面的高度 */
    overflow-y: auto;
  }

  i.collapse-control {
    position: absolute;
    top: 300px;
    left: 20.8%;
    z-index: 10;
    cursor: pointer;

    &.collapsed {
      left: 0;
    }
  }
  .hide {
    display: none;
  }
}
</style>
