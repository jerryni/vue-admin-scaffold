<template>
  <common-dialog :options="options" ref="commonDialog" 
    @onconfirm="onConfirm"
    @onbeforeclose="onBeforClose">
    <template slot="content">
      <el-form :model="couponItem" :rules="rules" ref="couponForm" label-width="150px">
        <el-form-item label="优惠券方案ID：" required prop="schemeId">
          <el-col :span="15">
            <el-input v-model.number="couponItem.schemeId"
              placeholder="最多20字符"
              type="number"
              :disabled="isSchemeIdExisted"></el-input>
          </el-col>
          <el-col :span="4" style="text-align:right;" v-if="!isSchemeIdExisted">
            <el-button type="primary" @click.prevent="addCouponBySchemeId">添加</el-button>
          </el-col>
        </el-form-item>
        <div class="wrap" v-if="isSchemeIdExisted">
        <h3>基本信息：</h3>
        <el-form-item label="优惠券名称：">
          <el-col :span="15">
            {{couponItem.schemeName}}
          </el-col>
        </el-form-item>
        <el-form-item label="优惠券面值：">
          <el-col :span="15">
            {{couponItem.couponAmount}}元
          </el-col>
        </el-form-item>
        <el-form-item label="使用类型：">
          <el-col :span="15">
            {{couponItem.couponType|couponType(couponItem)}}
          </el-col>
        </el-form-item>
        <el-form-item label="优惠券总数量：">
          <el-col :span="15">
            {{couponItem.totalNumberLimit}}
          </el-col>
        </el-form-item>
        <el-form-item label="每日派发数量：">
          <el-col :span="15">
            {{couponItem.dailyNumberLimit||'无限制'}} 
          </el-col>
        </el-form-item>
        <el-form-item label="派发范围：">
          <el-col :span="15">
            {{couponItem.ifSendNewUser|ifSendNewUser}}
          </el-col>
        </el-form-item>
        <el-form-item label="优惠券形式：">
          <el-col :span="15">
            {{couponItem.isIngredientCoupon|isIngredientCoupon}}
          </el-col>
        </el-form-item>
        <el-form-item label="方案开始时间：">
          <el-col :span="15">
            {{couponItem.openTime|formatTime('YYYY-MM-DD HH:mm:ss')}}
          </el-col>
        </el-form-item>
        <el-form-item label="方案结束时间：">
          <el-col :span="15">
            {{couponItem.closeTime|formatTime('YYYY-MM-DD HH:mm:ss')}}
          </el-col>
        </el-form-item>
        <h3>配置信息：</h3>
        <el-form-item label="优惠券展示名称：" prop="showSchemeName" required>
          <el-col :span="15">
            <el-input placeholder="优惠券展示名称（最多50字符）" v-model.trim="couponItem.showSchemeName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="展示开始时间：" required>
          <el-col :span="15">
            <el-form-item prop="startTime">
              <el-date-picker type="datetime" 
                placeholder="点击选择时间" 
                v-model="couponItem.startTime" 
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="展示结束时间：" required>
          <el-col :span="15">
            <el-form-item prop="endTime">
              <el-date-picker type="datetime" 
                placeholder="点击选择时间" 
                v-model="couponItem.endTime" 
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="优惠券图标：" required prop="icon">
          <el-col :span="6">
            <el-upload
              class="avatar-uploader"
              action="/frontpage/uploadimg.do?module=success&imgSize=225*225&isAllowPng=1"
              :show-file-list="false"
              name="imgFile"
              accept="image/*"
              :on-success="handleIconSuccess">
              <img v-if="couponItem.icon" :src="couponItem.icon" 
                class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="5">
            <el-button size="small" type="primary" @click="refreshIcon">刷新</el-button>
          </el-col>
          <el-col :span="24" class="note">
            <div>请上传225*225px的jpg或png图片，最多可上传1张</div>
          </el-col>
        </el-form-item>
        <el-form-item label="标签文案：" prop="promotionTag">
          <el-col :span="15">
            <el-input placeholder="最多14字符" v-model.trim="couponItem.promotionTag"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="点击跳转链接：" required>
          <el-col :span="12">
            <el-form-item prop="link">
              <el-input v-model.trim="couponItem.link"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left:10px">
            <span>默认链接（{{couponItem.linkType|linkType}}）</span>
          </el-col>
        </el-form-item>
        </div>
      </el-form>
    </template>
  </common-dialog>
</template>

<script>
import api from 'api'
import CommonDialog from '@/components/dialog/common'
import filters from '@/components/filters'
import validator from '@/components/validator'
import _ from '@/components/utils'

export default {
  name: 'coupon-dialog',
  filters,
  components: {CommonDialog},
  data () {
    return {
      isSchemeIdExisted: false,
      rules: {
        schemeId: [{
          validator: validator.emptyAndLengthLimit('优惠券方案ID', 20),
          trigger: 'change'
        }],
        showSchemeName: [{
          validator: validator.emptyAndLengthLimit('优惠券展示名称', 50),
          trigger: 'change'
        }],
        link: [
          { required: true, message: '请输入链接', trigger: 'change' },
          { max: 300, message: '链接最多300字符', trigger: 'change' }
        ],
        icon: [
          { required: true, message: '请上传优惠券图标', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择展示开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择展示结束时间', trigger: 'change' }
        ],
        promotionTag: [{
          validator: validator.lengthLimit('标签文案', 14),
          trigger: 'change'
        }]
      },
      fileList: [],
      fileList2: [],
      couponItem: this.getInitCoupon()
    }
  },
  props: {
    sortOrder: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  computed: {
    'options': function () {
      return {
        'title': this.isSchemeIdExisted ? '编辑' : '添加',
        'showClose': true,
        'buttons': this.isSchemeIdExisted
          ? ['确定', '取消'] : [],
        'handleClose': true
      }
    }
  },
  watch: {
    'couponItem.schemeId': function (val, oldVal) {
      val += ''
      this.couponItem.schemeId = val.replace(/\s+/g, '')
    },
    'couponItem.promotionTag': function (val, oldVal) {
      val += ''
      this.couponItem.promotionTag = val.replace(/\s+/g, '')
    },
    'couponItem.showSchemeName': function (val, oldVal) {
      val += ''
      this.couponItem.showSchemeName = val.replace(/\s+/g, '')
    },
    'couponItem.link': function (val, oldVal) {
      val += ''
      this.couponItem.link = val.replace(/\s+/g, '')
    }
  },
  created () {
  },
  methods: {
    $show ({
      navId = '',
      couponItem = null
    }) {
      this.navId = navId
      if (couponItem) {
        _.removeNull(couponItem)
      }
      this.couponItem = Object.assign(this.getInitCoupon(), couponItem)
      this.transData(this.couponItem)
      this.isSchemeIdExisted = !!couponItem
      this.$refs.commonDialog.$show()
      // 去除校验消息
      if (this.$refs.couponForm) {
        this.$refs.couponForm.resetFields()
      }
    },
    $close () {
      this.$refs.commonDialog.$close()
    },
    getInitCoupon () {
      return {
        schemeId: '',
        showSchemeName: '',
        icon: '',
        promotionTag: '',
        link: '',
        startTime: new Date(),
        endTime: new Date()
      }
    },
    addCouponBySchemeId () {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          api.getCouponSimpleById({
            navId: this.navId,
            schemeId: this.couponItem.schemeId
          }).then((data) => {
            // 后台标志，表示是否重复
            if (!data.newOrUpdate) {
              this.$message({
                type: 'warning',
                message: '优惠券方案ID重复，请更改'
              })
              return
            }

            _.removeNull(data.couponInfo)

            this.originCouponInfo = Object.assign({}, data.couponInfo)
            this.isSchemeIdExisted = true
            this.couponItem = Object.assign(this.getInitCoupon(), data.couponInfo)

            // 展示时间默认使用shcemeName
            this.couponItem.icon = this.couponItem.icon || ''
            this.couponItem.startTime = this.couponItem.openTime
            this.couponItem.endTime = this.couponItem.closeTime
            this.couponItem.showSchemeName = this.couponItem.schemeName
            this.transData(this.couponItem)
          })
        }
      })
    },

    transTimestampToObj (couponItem, fileds, isReverse) {
      fileds.forEach(filed => {
        couponItem[filed] = isReverse ? couponItem[filed].getTime()
            : new Date(couponItem[filed])
      })
    },

    // 时间转化
    transData (couponItem) {
      this.transTimestampToObj(couponItem, ['startTime', 'endTime'])
    },

    refreshIcon () {
      this.couponItem.icon = this.originCouponInfo.icon
    },

    onConfirm () {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          if (!this.validate(this.couponItem)) {
            return
          }
          api.newOrUpdateCouponItemInfo(this.getParams())
            .then(() => {
              this.$close()
              this.$emit('onconfirm')
            })
        } else {
          this.$message({
            type: 'warning',
            message: '请检查输入项有效性'
          })
        }
      })
    },

    validate (item) {
      if (!this.isSchemeIdExisted) {
        this.$message({
          type: 'warning',
          message: '请添加优惠券方案ID'
        })
        return false
      }
      if (_.getSeconds(item.startTime) < _.getSeconds(item.openTime)) {
        this.$message({
          type: 'warning',
          message: '展示开始时间必须大于等于方案开始时间'
        })
        return false
      }

      if (_.getSeconds(item.endTime) > _.getSeconds(item.closeTime)) {
        this.$message({
          type: 'warning',
          message: '展示结束时间必须小于等于方案结束时间'
        })
        return false
      }

      if (_.getSeconds(item.startTime) >= _.getSeconds(item.endTime)) {
        this.$message({
          type: 'warning',
          message: '展示结束时间必须大于展示开始时间'
        })
        return false
      }

      return true
    },
    getParams () {
      let cloneCouponItem = Object.assign({}, this.couponItem)

      cloneCouponItem.sortOrder = cloneCouponItem.sortOrder ||
          this.sortOrder
      this.transTimestampToObj(cloneCouponItem, ['startTime', 'endTime'], true)

      return cloneCouponItem
    },
    handleIconSuccess (res) {
      let url = _.extractUrl(res)

      // 判断是否是有效的图片链接，否则报错
      if (!/http/.test(url)) {
        this.$message({
          type: 'warning',
          message: url
        })
        return
      }

      this.couponItem.icon = url
    },
    onBeforClose (done) {
      let h = this.$createElement
      this.$msgbox({
        title: '提示',
        showCancelButton: true,
        message: h('div', null, [
          h('p', '是否确认关闭弹窗？'),
          h('p', {style: 'color: #FF4949'},
            '* 注意：修改内容不会被保存')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'cancel') {
          return
        }
        done()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-weight: bold;
  padding: 10px;
  border-top: 1px solid #eee;
}
.note {
  color: #999;
  font-size: 12px;
}
</style>
