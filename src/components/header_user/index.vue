<template>
  <div class="header_user">
    <div class="menu_toggle">
      <i :class="iconClass" @click="toggleBtn"></i>
    </div>
    <el-dropdown>
      <i class="el-icon-setting" style="margin-right: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="user">个人信息</el-dropdown-item>
        <el-dropdown-item v-if="user">
          <span @click="onLogout">退出登录</span>
        </el-dropdown-item>
        <el-dropdown-item v-else>
          <span @click="$router.replace('/login')">登录账号</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span>{{ user? user.info.name: '未登录'}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "HeaderUser",
  props: {
    isCollapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      collapseBtnClass: ["el-icon-s-fold", "el-icon-s-unfold"],
    };
  },
  computed: {
    ...mapState(['user']),
    iconClass() {
      return this.collapseBtnClass[Number(this.isCollapse)]
    }
  },
  methods: {
    toggleBtn() {
      this.$emit("changeCollapse");
    },
    onLogout() {
      console.log(1);
      this.$confirm('确定退出吗?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        });

        this.$store.commit('setUser', null);
        this.$router.replace('/login');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });          
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
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>