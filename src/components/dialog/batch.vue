<template>
  <common-dialog :options="options" ref="commonDialog" @onconfirm="onConfirm">
    <template slot="content">
      <el-form label-width="120px" class="demo-ruleForm">
        <el-form-item label="请选择文件：" prop="name">
          <el-col :span="12">
            <el-upload
              :action="url"
              :file-list="fileList"
              :on-success="handleUploadSuccess">
              <el-button type="primary">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="5" style="text-align:right">
            <a :href="tplLink" target="_blank">
              <el-button>{{tplTxt}}</el-button>
            </a>
          </el-col>
        </el-form-item>
      </el-form>
    </template>
  </common-dialog>
</template>

<script>
// import api from 'api'
import CommonDialog from './common'

export default {
  name: 'batch-dialog',
  components: {CommonDialog},
  props: {
    tplTxt: {
      type: String,
      default: () => {
        return '模板下载'
      }
    },
    title: {
      type: String,
      default: () => {
        return '批量添加'
      }
    },
    tplLink: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      url: '',
      fileList: [],
      options: {
        'title': this.title,
        'clazz': '',
        'buttons': ['确定']
      }
    }
  },
  created () {
  },
  methods: {
    $show ({url, tplLink}) {
      this.resetData()
      this.url = url
      this.tplLink = tplLink || this.tplLink || ''
      this.$refs.commonDialog.$show()
    },
    $close () {
      this.$refs.commonDialog.$close()
    },
    onConfirm () {
      this.$close()
    },

    handleUploadSuccess (data) {
      if (data.retCode !== 200) {
        this.$alert(`失败原因：${data.data && data.data.errMsg}`, '批量添加失败', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            this.fileList = []
          }
        })
      } else {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.$close()
        this.$emit('onconfirm')
      }
    },

    resetData () {
      this.fileList = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-wrapper {
  
}
</style>
