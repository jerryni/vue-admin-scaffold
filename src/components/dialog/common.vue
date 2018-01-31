<template>
  <el-dialog :title="options.title" :class="'m-dialog ' + options.clazz" :show-close="options.showClose" :top="top" :close-on-click-modal="closeOnClickModal" v-model="dialogVisible"
    :before-close="handleClose">
    <slot name="content"></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel" v-if="!!options.buttons[1]">{{options.buttons[1]}}</el-button>
      <el-button type="primary" @click="onConfirm" v-if="!!options.buttons[0]">{{options.buttons[0]}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { mapMutations, mapGetters, mapState } from 'vuex'
  export default {
    name: 'common-dialog',
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            'title': '提示',
            'clazz': '',
            'showClose': true,
            'buttons': ['确定', '取消']
          }
        }
      }
    },
    data () {
      return {
        dialogVisible: false,
        closeOnClickModal: false,
        top: '50%'
      }
    },
    methods: {
      onCancel () {
        this.$emit('onbeforeclose', () => {
          this.$close()
        })
        this.$emit('oncacnel')
        if (!this.options.handleClose) {
          this.$close()
        }
      },
      onConfirm () {
        this.$emit('onconfirm')
      },
      $show () {
        this.dialogVisible = true
      },
      $close () {
        this.dialogVisible = false
      },
      handleClose (done) {
        this.$emit('onbeforeclose', done)

        if (!this.options.handleClose) {
          this.$close()
        }
      }
    }
  }
</script>
<style>
  
.m-dialog{
  .el-dialog{
    transform: translate(-50%,-50%);
  }
  .el-dialog__body{
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
}

</style>
