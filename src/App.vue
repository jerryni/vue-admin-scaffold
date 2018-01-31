<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style>
@reset-global pc;
html, body {
  height: 100%
}

#app {
  position: relative;
}

.ellipsis {
  @utils-ellipsis;
}
.clearfix {
  @utils-clearfix;
}
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    display: block;
    max-width:100px;
    max-height:100px;
  }
}
</style>
