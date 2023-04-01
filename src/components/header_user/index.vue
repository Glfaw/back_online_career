<template>
  <div class="header_user">
    <div class="menu_toggle">
      <i :class="iconClass" @click="toggleBtn"></i>
      <el-breadcrumb class="ml_20 m_breadcrumb" separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.meta?.title">{{ $route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown class="drop_menu" trigger="click" @command="handleCommand">
      <div class="card">
        <el-avatar fit="contain" v-if="user&&user?.avatarUrl" shape="square" :size="30" :src="user.avatarUrl"></el-avatar>
        <el-avatar v-else shape="square" :size="30">
          <i class="el-icon-picture-outline"></i>
        </el-avatar>
        <span class="name">{{ user? user.name: '未登录'}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="INFO" v-if="user">个人中心</el-dropdown-item>
        <el-dropdown-item command="EXIT" v-if="user">退出登录</el-dropdown-item>
        <el-dropdown-item command="SIGN" v-else>登录账号</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "HeaderUser",
  props: {
    isCollapse: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      collapseBtnClass: ["el-icon-s-fold", "el-icon-s-unfold"]
    };
  },
  computed: {
    iconClass() {
      return this.collapseBtnClass[Number(this.isCollapse)]
    }
  },
  methods: {
    toggleBtn() {
      this.$emit("changeCollapse");
    },
    // 用户菜单
    handleCommand(command) {
      switch (command) {
        // 未登录
        case 'SIGN':
          this.$router.replace('/login')
          break;
        case 'INFO':
          this.$router.replace('/person')
          break;
        case 'EXIT':
          this.onLogout();
          break;
      }
    },
    // 退出登录
    onLogout() {
      this.$confirm('确定退出吗?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          type: 'warning',
          position: 'bottom-right',
          title: '已安全退出',
          message: '欢迎下次登录~',
        })

        this.$store.commit('SET_USER', null);
        this.$store.commit('SET_ROLES', null);
        this.$store.commit('SET_FIRMS', null);
        this.$router.replace('/login');
      }).catch(() => {
        this.$message({type: 'info', message: '已取消退出' });          
      });
    }
  },
};
</script>

<style lang="less">
.header_user {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;

  .menu_toggle {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;

    i {
      font-size: 24px;
      font-weight: 400;
      cursor: pointer;
      transform: translateY(-1px);
    }

    .m_breadcrumb {
      vertical-align: middle;
      font-size: 16px;
    }
  }

  .drop_menu {
    cursor: pointer;

    .card {
      display: flex;
      align-items: center;

      .name {
        margin-left: 10px;
      }
    }
  }
}
</style>