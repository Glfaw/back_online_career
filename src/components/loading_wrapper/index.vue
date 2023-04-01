<template>
  <section v-if="isLoading" class="loading_wrapper">
    <div class="loading_content">
      <i class="el-icon-loading mr_10"></i>
      <span>{{text}}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LoadingWrapper',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '加载中...'
    }
  },
  data() {
    return {
      text: this.label
    }
  },
  watch: {
    isLoading(status) {
      this.text = this.label
      if(status == false) this.text = ''
    }
  },
}
</script>

<style lang="less" scoped>
.loading_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #5c5c5c;
  background-color: rgba(255, 255, 255, .8);
  z-index: 10;

  .loading_content {
    display: flex;
    align-items: center;
    i {
      font-size: 30px;
    }
    span {
      font-size: 20px;
      font-weight: 400;
    }
  }
}
</style>