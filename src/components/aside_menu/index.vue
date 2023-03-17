<template>
  <el-menu
    router
    default-active="1"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
    :collapse="isCollapse"
  >
    <div class="logo">
      <i class="el-icon-menu icon" ></i>
      <p class="title" v-if="!isCollapse">网上招聘与求职</p>
    </div>
    <el-menu-item index="1" route="/">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template #title>
        <i class="el-icon-setting"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="2-1" route="/user">
          <i class="el-icon-user-solid"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="2-2" route="/role">
          <i class="el-icon-postcard"></i>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="2-3" route="/menu">
          <i class="el-icon-notebook-1"></i>
          <span>菜单管理</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="3" route="/dashboard">
      <i class="el-icon-location"></i>
      <span>数据报表</span>
    </el-menu-item>
    <el-menu-item index="4" route="/log">
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
.logo {
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