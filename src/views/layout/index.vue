<template>
  <el-container class="layout">
    <!--  侧边菜单  -->
    <el-aside :width="`${asideWidth}px`">
      <aside-menu :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header style="background: linear-gradient(to left, #8c939d, #55585a);">
        <header-user :user="user" :isCollapse="isCollapse" :isLoading="isLoading" @changeCollapse="handleCollapseChange" />
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main_page">
        <el-backtop target=".main_page" :visibility-height="20" :right="30">
          <i class="el-icon-caret-top"></i>
        </el-backtop>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {debounce} from 'lodash'
import {mapState} from 'vuex'
import AsideMenu from "@/components/aside_menu"
import HeaderUser from "@/components/header_user"
import {ShowMsg} from "@/utils/common"
import {loadPersonal, refreshPersonal} from "@/api/purview"
import {setRoutes} from '@/router'

export default {
  name: "Layout",
  components: { AsideMenu, HeaderUser },
  data() {
    return {
      menu: [],
      isCollapse: false,
      isLoading: false,
      currentID: null,
      currentToken: null
    };
  },
  mounted() {
    if(this.user?.token) {
      this.$store.dispatch('loadRoles')
      this.$store.dispatch('loadFirms')
    }
  },
  created() {
    const {id, token} = this.user
    this.currentID = id
    this.currentToken = token
    // 绑定同步更新用户信息
    this.$bus.$on('refreshUser', data => {
      // 开始更新用户数据
      this.handlePutUser(data)
    })
    // 绑定同步更新菜单信息
    this.$bus.$on('refreshMenu', () => {
      this.$store.dispatch('loadMenus', this.user)
      setRoutes()
    })
  },
  beforeDestroy() {
    this.$bus.$off(['refreshUser', 'refreshMenu'])
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
    toggleStorage(data) {
      Object.assign(this.user, data)
      this.user.token = this.currentToken
      this.$store.commit('SET_USER', this.user)
      ShowMsg('用户信息更新成功', 'success')
    },
    async handlePutUser(user) {
      try {
        const res = await refreshPersonal(user)
        if (res.code === 200) {
          this.handleGetUser()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleGetUser() {
      let status = false
      try {
        const {code, data, msg} = await loadPersonal(this.currentID)
        if (code === 200) {
          status = true
          this.toggleStorage(data)
        } else ShowMsg(msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.$bus.$emit('refreshUserStatus', status)
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

  .el-card {
    .command {
      transform: translateY(-5px);
    }
  }

  .main_page {
    position: relative;
    background-color: #f3f3f3;

    .el-backtop {
      color: #fff;
      background-color: #55585a;
    }
  }
}
</style>