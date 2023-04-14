<template>
  <el-container class="layout">
    <el-aside class="aside_container" :width="`${asideWidth}px`">
      <aside-menu class="aside_menu" :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header style="border-bottom: 1px solid #e4e4e4">
        <header-user :user="user" :isCollapse="isCollapse" @changeCollapse="handleCollapseChange" />
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main_page">
        <el-backtop target=".main_page" :visibility-height="20" :right="30">
          <i class="el-icon-caret-top"></i>
        </el-backtop>
        <!-- 子路由出口 -->
        <router-view @refreshUser="renovateUser" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from "@/components/aside_menu";
import HeaderUser from "@/components/header_user";
import { mapState } from 'vuex'
import { loadPersonal } from '@/api/user'

export default {
  name: "Layout",
  components: { AsideMenu, HeaderUser },
  data() {
    return {
      isCollapse: false, 
    };
  },
  created() {
    if(this.user?.token) {
      this.$store.dispatch('loadRoles');
      this.$store.dispatch('loadFirms');
    }
  },
  computed: {
    ...mapState(['user']),
    asideWidth() {
      return this.isCollapse ? 64 : 200;
    },
  },
  methods: {
    showMsg(message, type = 'warning') {
      this.$message({type, message, showClose: true})
    },
    handleCollapseChange() {
      this.isCollapse = !this.isCollapse;
    },
    refreshStorage(data) {
      let token = this.user.token
      Object.assign(this.user, data)
      this.user.token = token
      this.$store.commit('SET_USER', this.user)
      this.showMsg('用户信息更新成功', 'success')
    },
    async renovateUser(id) {
      try {
        const res = await loadPersonal(id)
        if(res.code == 200) {
          this.refreshStorage(res.data)
        } else this.showMsg(res.msg)
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    }
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
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);

    .aside_menu {
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