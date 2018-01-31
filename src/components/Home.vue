<template>
  <div class="wrapper">
    <el-row class="header">
      <el-col :span="4" class="logo" :class="collapsed?'hide':''">
        活动后台
      </el-col>
      <el-col :span="16">
        <i class="el-icon-menu" @click.prevent="collapse"></i>
      </el-col>
      <el-col :span="4" class="welcome">
        欢迎，<span class="username">{{userName}}</span>
      </el-col>
    </el-row>
    <el-row class="container">
      <el-col :span="4" class="left-nav" :class="collapsed?'hide':''">
        <el-menu mode="vertical" default-active="1" class="el-menu-vertical">
          <el-submenu index="1">
            <template slot="title">优惠券管理</template>
            <el-menu-item index="1">领券中心配置</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="collapsed?24 : 20" class="content">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from 'api'
export default {
  name: 'Home',
  data () {
    return {
      collapsed: false,
      userName: ''
    }
  },
  created () {
    api.getGlobalInfo().then((info) => {
      this.userName = info.userName || '小考拉'
    })

    api.proxyTest()
  },
  methods: {
    collapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  height: 60px;
  line-height: 60px;
  background: #20a0ff;
  color: #fff;
  .logo {
    height: 60px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid;
  }
  .el-icon-menu {
    padding-left: 20px;
    cursor: pointer;
  }
  .welcome {
    color: #fff;
    text-align: right;
    float: right;
    padding-right: 20px
  }
}

.left-nav {
  height: calc(100vh - 60px);
  .el-menu-vertical {
    height: 100%;
  }
}

.hide {
  display: none;
}

</style>
