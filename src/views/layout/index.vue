<template>
  <el-container class="layout">
    <el-aside class="aside_container" :width="`${asideWidth}px`">
      <aside-menu class="aside_menu" :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header style="border-bottom: 1px solid #e4e4e4">
        <header-user :isCollapse="isCollapse" @changeCollapse="onChange" />
      </el-header>

      <!-- 内容区域 -->
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from "@/components/aside_menu";
import HeaderUser from "@/components/header_user";

export default {
  name: "Layout",
  components: { AsideMenu, HeaderUser },
  data() {
    return {
      isCollapse: false, 
    };
  },
  computed: {
    asideWidth() {
      return this.isCollapse ? 64 : 200;
    },
  },
  methods: {
    onChange() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less">
.layout {
  width: 100vw;
  height: 100vh;
  .aside_container {
    //overflow: unset;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);

    .aside_menu {
      height: 100%;
      // overflow: hidden;
    }
  }
}
</style>