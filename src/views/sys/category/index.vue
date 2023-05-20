<template>
  <section class="category_container">
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="企业类型" name="firm">
        <to-firm />
      </el-tab-pane>
      <el-tab-pane label="职位类型" name="career">
        <to-career />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import ToFirm from '@/views/sys/category/components/ToFirm'
import ToCareer from '@/views/sys/category/components/ToCareer'
export default {
  name: "CategoryView",
  components: {ToCareer, ToFirm},
  data() {
    return {
      activeTab: 'firm',
    }
  },
  methods: {
    handleTabChange(tab) {
      this.$nextTick(tab.$children[0].$refs.table.doLayout)
    },
  }
}
</script>

<style lang="less">
.category_container {

}
</style>