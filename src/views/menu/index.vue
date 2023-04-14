<template>
  <section class="menu_container">
    <el-card>
      <div slot="header">
        <span>菜单列表</span>
        <div class="command fl_r">
          <el-button size="small" type="success" icon="el-icon-menu">添加菜单</el-button>
        </div>
      </div>
      <el-table  stripe :data="tableData.filter(data => !formMenuName || data.name.includes(formMenuName))" v-loading="isTableLoading">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="icon" label="菜单图标" width="120" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单名称" width="120"></el-table-column>
        <el-table-column prop="path" label="菜单路由" width="120"></el-table-column>
        <el-table-column prop="description" label="菜单描述"></el-table-column>
        <el-table-column width="300" align="right">
          <template slot="header" slot-scope="scope">
            <el-input size="small" prefix-icon="el-icon-menu" placeholder="输入菜单名称搜索" v-model="formMenuName"></el-input>
          </template>
          <template slot-scope="scope">
            <el-button class="mr_10" size="mini" type="warning" icon="el-icon-edit">编辑</el-button>
            <el-popconfirm title="确定要删除吗?" @confirm="handleRowDel(scope.row.id)">
              <el-button slot="reference" size="mini" type="danger" icon="el-icon-remove-outline">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'MenuView',
  data() {
    return {
      tableData: [
        {id: 101, icon: 'el-icon-user', name: '首页', path: '/home', description: 'xxxx'},
        {id: 101, icon: 'el-icon-position', name: '首页', path: '/home', description: 'xxxx'},
        {id: 101, icon: 'el-icon-phone', name: '首页', path: '/home', description: 'xxxx'},
        {id: 101, icon: 'el-icon-menu', name: '首页', path: '/home', description: 'xxxx'},
      ],
      formMenuName: "",
      isTableLoading: false
    }
  },
  created() {

  },
  methods: {
    handleRowDel(id) {

    }
  }
}
</script>

<style lang="less">
.menu_container {
}
</style>