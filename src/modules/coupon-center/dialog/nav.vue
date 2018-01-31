<template>
  <common-dialog :options="options" ref="commonDialog" 
    @onconfirm="onConfirm">
    <template slot="content">
      <el-form :model="_navItem" :rules="rules" ref="ruleForm" 
          label-width="200px">
        <el-form-item label="导航名称：" prop="name">
          <el-col :span="15">
            <el-input v-model.trim="_navItem.name"
              placeholder="请输入导航名称（最多12字符）"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="展示开始时间：" required>
          <el-col :span="15">
            <el-form-item prop="startTime">
              <el-date-picker type="datetime" 
                placeholder="点击选择时间" 
                v-model="_navItem.startTime" 
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="展示结束时间：" required>
          <el-col :span="15">
            <el-form-item prop="endTime">
              <el-date-picker type="datetime" 
                placeholder="点击选择时间" 
                v-model="_navItem.endTime" 
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </template>
  </common-dialog>
</template>

<script>
import api from 'api'
import CommonDialog from '@/components/dialog/common'
import validator from '@/components/validator'
import _ from '@/components/utils'

export default {
  name: 'navDialog',
  components: {CommonDialog},
  props: {
    sortOrder: {
      type: Number,
      default: () => {
        return 1
      }
    },
    editType: {
      type: String,
      default: () => {
        return 'add'
      }
    },
    navItem: {
      type: Object,
      default: () => {
        return this.getInitNavData()
      }
    }
  },
  data () {
    return {
      rules: {
        name: [{
          validator: validator.emptyAndLengthLimit('导航名称', 12),
          trigger: 'change'
        }],
        startTime: [{
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }],
        endTime: [{
          type: 'date',
          required: true,
          message: '请选择时间',
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    options: function () {
      return {
        'title': this.editType === 'update'
          ? '编辑导航' : '新增导航',
        'clazz': 'm-rejectWin',
        'showClose': true,
        'buttons': ['确定', '取消']
      }
    },
    _navItem: function () {
      if (this.editType === 'add') {
        return this.getInitNavData()
      } else {
        return Object.assign(this.getInitNavData(), this.navItem)
      }
    }
  },
  watch: {
    '_navItem.name': function (val, oldVal) {
      val += ''
      this._navItem.name = val.replace(/\s+/g, '')
    }
  },
  created () {
  },
  methods: {
    $show () {
      this.$refs.commonDialog.$show()
      this.resetForm()
    },
    $close () {
      this.$refs.commonDialog.$close()
    },
    getInitNavData () {
      return {
        name: '',
        startTime: '',
        endTime: ''
      }
    },
    resetForm () {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
    },
    onConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.validate(this._navItem)) {
            return
          }
          api.newOrUpdateNavItem(this.transParams(this._navItem))
            .then(data => {
              this.$close()
              this.$emit('onconfirm', this._navItem)
            })
        }
      })
    },

    validate (item) {
      // 由于时间组件的 ‘此刻’是精确到毫秒的，导致对比错误，所以将毫秒转化为秒进行对比
      if (_.getSeconds(item.startTime) >= _.getSeconds(item.endTime)) {
        this.$message({
          type: 'error',
          message: '展示开始时间必须小于展示结束时间'
        })
        return false
      }

      return true
    },

    // 将时间转化为时间戳, 排序ID动态生成
    transParams (navItem) {
      let clone = Object.assign({}, navItem)
      clone.startTime = new Date(clone.startTime).getTime()
      clone.endTime = new Date(clone.endTime).getTime()
      clone.sortOrder = clone.sortOrder || this.sortOrder
      return clone
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-wrapper {
  
}
</style>
