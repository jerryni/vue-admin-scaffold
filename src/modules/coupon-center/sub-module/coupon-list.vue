<template>
  <div class="wrapper">
    <el-row class="toolbar">
      <span style="font-size:12px">展示状态：</span>
      <el-select v-model="couponShowStatus" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <span style="font-size:12px">展示时间：</span>
      <el-button type="primary"
        size="small" 
        @click="setTomorrow">明天</el-button>
      <el-date-picker
        v-model="startTime"
        type="datetime"
        placeholder="选择开始时间">
      </el-date-picker>
      -
      <el-date-picker
        v-model="endTime"
        type="datetime"
        placeholder="选择结束时间">
      </el-date-picker>
      <el-row class="sub-row">
        <el-button type="primary"
          @click.prevent="search">
          搜索
        </el-button>  
        <el-button :plain="true" type="info" 
          @click.prevent="reset">
          重置
        </el-button>
      </el-row>
    </el-row>
    <el-row class="toolbar">
      <el-button type="primary" @click="addCoupon">
        添加
      </el-button>
      <el-button type="primary" @click="batchAddCoupon">
        批量添加
      </el-button>
      <el-button type="primary" @click="batchSort">
        排序
      </el-button>
      <el-button type="danger" style="float:right" @click="batchDel">
        删除
      </el-button>
    </el-row>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="couponList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="前台序号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="schemeId"
        label="优惠券方案ID"
        width="130">
      </el-table-column>
      <el-table-column
        label="优惠券图标"
        width="120">
        <template scope="scope">
          <img :src="scope.row.icon" style="max-width: 100%;max-height:100%">
        </template>
      </el-table-column>
      <el-table-column
        prop="showSchemeName"
        label="优惠券展示名称"
        width="140">
      </el-table-column>
      <el-table-column
        label="展示开始时间"
        width="170">
        <template scope="scope">
          {{scope.row.startTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="展示结束时间"
        width="170">
        <template scope="scope">
          {{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="优惠券形式"
        width="120">
        <template scope="scope">
          {{scope.row.isIngredientCoupon|isIngredientCoupon}}
        </template>
      </el-table-column>
      <el-table-column
        label="使用类型"
        width="120">
        <template scope="scope">
          {{scope.row.couponType|couponType(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="couponAmount"
        label="优惠券面值"
        width="120">
        <template scope="scope">
          {{scope.row.couponAmount}}元
        </template>
      </el-table-column>
      <el-table-column
        prop="totalNumberLimit"
        label="优惠券总数量"
        width="130">
      </el-table-column>
      <el-table-column
        prop="name"
        label="优惠券剩余数量"
        width="140">
        <template scope="scope">
          {{ scope.row.remainNumber }}
        </template>
      </el-table-column>
      <!-- 默认显示不限制 -->
      <el-table-column
        prop="dailyNumberLimit"
        label="每日派发数量"
        width="130">
        <template scope="scope">
          {{scope.row.dailyNumberLimit||'不限制'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="今日领取进度"
        width="130">
        <template scope="scope">
          <span v-if="scope.row.showStatus==2">--</span>
          <span v-else>{{scope.row.ratio||'100%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="展示状态"
        width="120">
        <template scope="scope">
          <span v-if="scope.row.showStatus==2" style="color:#FF4949">隐藏</span>
          <span v-if="scope.row.showStatus==1">展示</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="name"
        label="操作"
        width="140">
        <template scope="scope">
          <el-button
            size="small"
            @click="editCoupon(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delCoupon(scope.row)">删除</el-button>
          <br/>
          <el-button
            size="small"
            style="margin-top:10px"
            v-if="scope.$index!=0"
            @click.prevent="move(scope.$index, couponList)">上移</el-button>
          <el-button
            size="small"
            style="margin-top:10px"
            v-if="scope.$index!=couponList.length-1"
            @click.prevent="move(scope.$index, couponList, 1)">下移</el-button>
        </template>
      </el-table-column>
    </el-table>
    <coupon-dialog ref="couponDialog" 
      @onconfirm="onConfirmCouponDialog"
      :sortOrder="sortOrder"></coupon-dialog>
    <batch-dialog ref="batchImport"
      @onconfirm="onBatchImportSuccess"
      tplLink="https://haitao.nos.netease.com/7fa35307-ccc3-41c3-a4fb-dcb153f44e8f.xlsx"></batch-dialog>
    <batch-dialog ref="batchImportSort" 
      @onconfirm="onBatchImportSortSuccess"
      tplLink=""
      :tplTxt="tplTxt"
      :title="sortTitle"></batch-dialog>
  </div>
</template>

<script>
import api from 'api'
import couponDialog from '../dialog/coupon'
import batchDialog from '@/components/dialog/batch'
import filters from '@/components/filters'
import _ from '@/components/utils'

export default {
  name: 'coupon-list',
  filters,
  components: {couponDialog, batchDialog},
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '明天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() + 1)
            start.setHours(0, 0, 0, 0)
            end.setDate(start.getDate() + 1)
            end.setHours(23, 59, 59, 0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 2,
        label: '隐藏'
      }, {
        value: 1,
        label: '展示'
      }],
      couponShowStatus: 0,
      couponList: [],
      tplTxt: '原排序下载',
      sortTitle: '排序',
      multipleSelection: [],
      loading: false,
      startTime: this.getToday().start,
      endTime: this.getToday().end
    }
  },
  computed: {
    sortOrder: function () {
      if (!this.couponList || !this.couponList.length) {
        return 1
      }
      return this.couponList.reduce((result, item) => {
        return result.sortOrder > item.sortOrder ? result : item
      }).sortOrder + 1
    }
  },
  created () {
    if (!this.$route.params.navId) {
      return
    }

    this.navId = this.$route.params.navId
    this.getList()
  },
  watch: {
    '$route' (to, from) {
      this.navId = this.$route.params.navId
      if (!this.navId) {
        return
      }
      this.getList()
    }
  },
  methods: {
    getList () {
      if (!this.validate()) {
        return
      }
      this.loading = true
      api.getCouponListByNavId(_.removeNull(this.getListParams())).then((data) => {
        this.couponList = data.couponList
        this.processList(this.couponList)
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    processList (list) {
      list.forEach(coupon => {
        // 剩余数量
        coupon.remainNumber = coupon.totalNumberLimit - coupon.totalNumber
      })
    },

    setTomorrow () {
      let end = new Date()
      let start = new Date()
      start.setDate(start.getDate() + 1)
      start.setHours(0, 0, 0, 0)
      end.setDate(end.getDate() + 1)
      end.setHours(23, 59, 59, 0)
      this.startTime = start
      this.endTime = end
    },

    validate () {
      if (this.startTime && this.endTime) {
        if (_.getSeconds(this.startTime) >=
          _.getSeconds(this.endTime)) {
          this.$message({
            type: 'warning',
            message: '开始时间必须小于结束时间'
          })

          return false
        }
      }

      return true
    },
    getListParams () {
      return {
        navId: this.navId,
        couponShowStatus: this.couponShowStatus,
        startTime: this.dateToTimeStramp(this.startTime),
        endTime: this.dateToTimeStramp(this.endTime)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    dateToTimeStramp (date) {
      // 如果是0 改成null， 方便后端处理
      return new Date(date).getTime() || null
    },
    reset () {
      this.startTime = this.getToday().start
      this.endTime = this.getToday().end
      this.couponShowStatus = 0
    },
    getToday () {
      const start = new Date()
      const end = new Date()

      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 0)
      return {start, end}
    },
    search () {
      this.getList()
    },
    addCoupon () {
      this.editType = 'add'
      this.$refs.couponDialog.$show({
        navId: this.navId
      })
    },
    editCoupon (coupon) {
      let cloneCoupon = Object.assign({}, coupon)
      this.editType = 'update'
      this.$refs.couponDialog.$show({
        navId: this.navId,
        couponItem: cloneCoupon
      })
    },
    batchAddCoupon () {
      this.$refs.batchImport.$show({
        url: `/couponcenter/batchImportCoupon.do?navId=${this.navId}`
      })
    },

    // 批量排序
    batchSort () {
      this.$refs.batchImportSort.$show({
        url: `/couponcenter/batchImportCouponSortOrder.do?navId=${this.navId}`,
        tplLink: `/couponcenter/batchExportCouponSortOrder.do?navId=${this.navId}`
      })
    },
    delCoupon (coupon) {
      this.showDelNotice(() => {
        this.onBatchDel([coupon.id])
      })
    },
    batchDel () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请先进行选择！'
        })
        return
      }
      let ids = this.multipleSelection.map(coupon => coupon.id)

      this.showDelNotice(() => {
        this.onBatchDel(ids)
      })
    },
    showDelNotice (callback) {
      let h = this.$createElement
      this.$msgbox({
        title: '提示',
        showCancelButton: true,
        message: h('div', null, [
          h('p', '是否确认删除所有选中项目？'),
          h('p', {style: 'color: #FF4949'},
            '* 注意：前台相应的优惠券展示会立即消失')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'cancel') {
          return
        }

        callback()
      })
    },
    onBatchDel (params) {
      api.batchDeleteCouponItemByIds(params).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })

        this.getList()
      })
    },
    onConfirmCouponDialog () {
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
      this.reset()
      this.getList()
    },
    onBatchImportSuccess () {
      this.reset()
      this.getList()
      this.$message({
        type: 'success',
        message: '批量新建成功'
      })
    },
    onBatchImportSortSuccess () {
      this.getList()
      this.$message({
        type: 'success',
        message: '排序已完成'
      })
    },
    move (index, list, isDownward) {
      let id1
      let id2

      id1 = list[index].id
      id2 = list[isDownward ? index + 1 : index - 1].id

      api.changeCouponOrder({
        id1,
        id2
      }).then(() => {
        this.getList()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  padding: 0 15px;
}

.sub-row {
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #ddd;
}
.toolbar {
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0px;
}
</style>
