<template>
  <el-container class="layout">
    <!--  侧边菜单  -->
    <el-aside class="aside_container" :width="`${asideWidth}px`">
      <aside-menu class="aside_menu" :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <header-user :user="user" :isCollapse="isCollapse" :isLoading="isLoading" @changeCollapse="handleCollapseChange" />
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main_page">
        <el-backtop target=".main_page" :visibility-height="20" :right="30">
          <i class="el-icon-caret-top"></i>
        </el-backtop>
        <!-- 子路由出口 -->
        <router-view
          @refreshUser="reSetUser"
          @refreshRouteMenu="refreshRouteMenu"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import AsideMenu from "@/components/aside_menu"
import HeaderUser from "@/components/header_user"
import { ShowMsg, LoadingWrapper } from "@/utils/common"
import { loadRouteMenu, loadPersonal } from "@/api/purview"

export default {
  name: "Layout",
  components: { AsideMenu, HeaderUser },
  data() {
    return {
      menu: [],
      isCollapse: false,
      isLoading: false
    };
  },
  mounted() {
    if(this.user?.token) {
      this.$store.dispatch('loadRoles')
      this.$store.dispatch('loadFirms')
    }
  },
  computed: {
    ...mapState(['user']),
    asideWidth() {
      return this.isCollapse ? 64 : 200;
    },
  },
  methods: {
    handleCollapseChange() {
      this.isCollapse = !this.isCollapse;
    },
    refreshUser(data) {
      let token = this.user.token
      Object.assign(this.user, data)
      this.user.token = token
      this.$store.commit('SET_USER', this.user)
      this.$store.dispatch('loadMenus', this.user)
    },
    refreshRouteMenu() {
      this.reSetUser(this.user.id)
    },
    async reSetUser(id) {
      try {
        const {code, data, msg} = await loadPersonal(id)
        code === 200? this.refreshUser(data): ShowMsg(msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
  },
};
</script>

<style lang="less">
.layout {
  width: 100vw;
  height: 100vh;

  .el-select {
    width: 100%;
  }

  .aside_container {
    .aside_menu {
      display: flex;
      flex-flow: column nowrap;
      height: 100vh;
      overflow: hidden;
    }
  }

  .el-card {
    .command {
      transform: translateY(-5px);
    }
  }

  .main_page {
    position: relative;
    background-color: #F3F5F7;

    .el-backtop {
      color: #fff;
      background-color: #55585a;
    }
  }
}
</style>