<template>
  <el-menu
    router
    ref="elMenu"
    unique-opened
    text-color="#eee"
    class="aside_menu_container"
    active-text-color="#409EFF"
    background-color="#304156"
    :collapse="isCollapse"
    :collapse-transition="false"
    :default-active="$route.path">
    <div class="aside_logo">
      <i class="icon mr_5"></i>
      <span v-if="!isCollapse">网上招聘与求职</span>
    </div>
    <div class="aside_content">
      <template v-for="menu in treeMenu">
        <el-menu-item :key="menu.id" :index="menu.path" v-if="menu.path">
          <i :class="menu.icon"></i>
          <span slot="title">{{ menu.name }}</span>
        </el-menu-item>
        <el-submenu :key="menu.id" :index="`${menu.id}`" v-else>
          <template slot="title">
            <i :class="menu.icon"></i>
            <span v-if="!isCollapse" slot="title">{{ menu.name }}</span>
          </template>
          <template v-for="sub in menu.children">
            <el-menu-item :key="sub.id" :index="sub.path">
              <i :class="sub.icon"></i>
              <span slot="title">{{ sub.name }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </div>
  </el-menu>
</template>

<script>
import {mapState} from 'vuex'
import {LoadingWrapper} from '@/utils/common'

export default {
  name: "AsideMenu",
  props: {
    isCollapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['treeMenu'])
  },
  watch: {
    // 深度监听树形菜单的变化，发生变化执行load，需要避开加载就执行
    treeMenu: {
      handler() {
        this.handleLoading();
      },
      deep: true
    },
  },
  methods: {
    handleLoading() {
      const load = LoadingWrapper({
        text: '努力加载中',
        target: this.$refs.elMenu.$el.children[1],
        background: 'rgba(0,0,0, .6) !important'
      })

      load.close()
    }
  },
};
</script>

<style lang="less">
.aside_menu_container {
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  border-right: unset;

  .aside_logo {
    display: flex;
    align-items: center;
    padding-left: 22px;
    height: 60px;
    font-size: 20px;
    color: #f5f5f5;
    background-color: #5470c6;

    .icon {
      width: 22px;
      height: 20px;
      background-image: url("~@/assets/layout/layout_logo.png");
      background-repeat: no-repeat;
      background-size: 20px;
    }

    span {
      font-size: 16px;
    }
  }

  .aside_content {
    flex: 1;

    li i {
      color: #eee;
    }
  }
}
</style>