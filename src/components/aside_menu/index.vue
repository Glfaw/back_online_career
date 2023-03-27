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
      <i class="el-icon-menu icon" ></i>
      <p class="title" v-if="!isCollapse">网上招聘与求职</p>
    </div>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>
    <el-submenu index="sys">
      <template #title>
        <i class="el-icon-setting"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/user">
          <i class="el-icon-user-solid"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/role">
          <i class="el-icon-postcard"></i>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-notebook-1"></i>
          <span>菜单管理</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/dashboard">
      <i class="el-icon-location"></i>
      <span>数据报表</span>
    </el-menu-item>
    <el-menu-item index="/log">
      <i class="el-icon-location"></i>
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
  color: #f3f5f7;

  .icon {
    font-size: 18px;
    margin-right: 10px;
  }
}
</style>