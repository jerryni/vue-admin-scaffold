<template>
  <div class="wrapper">
    <el-row>
      <el-col :span="24" class="operation-bar">
        <el-button type="primary" @click="addNav">新建导航</el-button>
      </el-col>
    </el-row>
    <div class="navlist" v-loading="loading">
      <div v-for="(nav, index) in navList" 
        class="nav" 
        :class="curNavId == nav.id ?'seleceted': ''">
        <router-link :to="{ name: 'couponCenter', params: { navId: nav.id}}">
          <el-button :plain="true" type="info" size="small" 
          >{{nav.name}}</el-button>
        </router-link>
        <a href="javascript:;" @click.prevent="editNav(nav)">编辑</a>
        <a href="javascript:;" @click.prevent="delNav(nav)">删除</a>
        <a href="javascript:;" v-if="index!=0"
          @click.prevent="move(index, navList)">上移</a>
        <a href="javascript:;" v-if="index!=(navList.length-1)" 
          @click.prevent="move(index, navList, 1)">下移</a>
      </div>
    </div>
    <nav-dialog ref="navDialog" 
      :sortOrder="sortOrder"
      :editType="editType"
      @onconfirm="onConfirmNavDialog"
      :navItem="navItem"
      :listLength="navList.length"></nav-dialog>
  </div>
</template>

<script>
import api from 'api'
import navDialog from '../dialog/nav'
export default {
  name: 'nav-list',
  data () {
    return {
      loading: false,
      curNavId: null,
      navItem: {},
      navList: [],
      editType: 'add'
    }
  },
  watch: {
    '$route' (to, from) {
      this.initRouterNavId()
    }
  },
  computed: {
    sortOrder: function () {
      if (!this.navList || !this.navList.length) {
        return 1
      }
      return this.navList.reduce((result, item) => {
        return result.sortOrder > item.sortOrder ? result : item
      }).sortOrder + 1
    }
  },
  components: {navDialog},
  created () {
    // 如果已经
    this.getList()
  },
  methods: {
    getList (notNeedLoading) {
      this.loading = true
      api.getAllNavList().then(data => {
        this.navList = data.navList || []
        this.initRouterNavId()
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    // 如果路由navId不存在，那么就取第一个nav的id，进行路由跳转
    initRouterNavId () {
      if (!this.navList.length) {
        return
      }

      let isNavIdExisted = this.navList.some((nav) => {
        return nav.id === parseInt(this.$route.params.navId)
      })

      if (!isNavIdExisted) {
        let targetId = this.navList[0].id
        this.$router.push({
          name: 'couponCenter',
          params: { navId: targetId }
        })
      } else {
        this.curNavId = this.$route.params.navId
      }
    },
    delNav (nav) {
      let h = this.$createElement
      let vNodeMessage = h('div', null, [
        h('p', '是否确认删除此导航？'),
        h('p', {style: 'color: #FF4949'},
          '* 注意：此导航下所有的优惠券列表信息都会被删除')
      ])

      this.$msgbox({
        title: '提示',
        showCancelButton: true,
        message: vNodeMessage,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'cancel') {
          return
        }

        this.onDelNav(nav)
      })
    },

    onDelNav (nav) {
      api.deleteNavItem({
        id: nav.id
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })

        this.getList()
      })
    },
    addNav () {
      this.editType = 'add'
      this.$refs.navDialog.$show()
    },
    editNav (nav) {
      let cloneNav = Object.assign({}, nav)
      cloneNav.startTime = new Date(cloneNav.startTime)
      cloneNav.endTime = new Date(cloneNav.endTime)
      this.navItem = cloneNav
      this.editType = 'update'
      this.$refs.navDialog.$show()
    },
    move (index, list, isDownward) {
      let id1
      let id2

      id1 = list[index].id
      id2 = list[isDownward ? index + 1 : index - 1].id

      api.changeNavOrder({
        id1,
        id2
      }).then(() => {
        this.getList()
      })
    },
    onConfirmNavDialog (nav) {
      if (this.editType === 'add') {
        this.$message({
          type: 'success',
          message: '添加成功！'
        })
      } else {
        this.$message({
          type: 'success',
          message: '编辑成功！'
        })
      }
      this.getList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  /* padding: 15px; */
  .operation-bar {
    padding: 15px;
    border-bottom: solid 1px #eee;
  }

  .navlist {
    height: calc(100vh - 194px); /* 减去上面的高度 */
    overflow-y: auto;
    .nav {
      padding: 10px 0 10px 15px;
      font-size: 13px;
      
      .el-button {
        white-space: normal;
        width: 70px;
        margin-right: 5px;
        line-height: 14px;
      }

      &.seleceted {
        background: #c9e5f5;
      }
    }
  }
}
</style>
