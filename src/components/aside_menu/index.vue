<template>
  <el-menu
    router
    :default-active="$route.path"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
    :collapse="isCollapse"
  >
    <div class="aside_logo">
      <i class="el-icon-s-shop mr_10"></i>
      <span v-if="!isCollapse">网上招聘与求职</span>
    </div>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/person">
      <i class="el-icon-monitor"></i>
      <span>个人中心</span>
    </el-menu-item>
    <el-submenu index="sys">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/user">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/role">
          <i class="el-icon-s-custom"></i>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-menu"></i>
          <span>菜单管理</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/dashboard">
      <i class="el-icon-data-line"></i>
      <span>数据报表</span>
    </el-menu-item>
    <el-menu-item index="/log">
      <i class="el-icon-toilet-paper"></i>
      <span>日志管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AsideMenu",
  props: {
    isCollapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
  },
};
</script>

<style lang="less">
.aside_logo {
  display: flex;
  align-items: center;
  padding-left: 22px;
  height: 60px;
  font-size: 20px;
  color: #f3f5f7;
  border-bottom: 1px solid #e4e4e4;

  span {
    font-size: 16px;
  }
}
</style>