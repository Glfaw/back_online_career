<template>
  <section class="menu_container">
    <el-dialog width="450px" title="菜单信息" :visible.sync="menuDialogVisible">
      <el-form :model="menuForm">
        <el-form-item label="名称">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label">
            <span class="mr_5">图标</span>
            <i :class="`${menuForm.icon? menuForm.icon: 'el-icon-s-opportunity'}`"></i>
          </div>
          <el-select v-model="menuForm.icon" filterable clearable placeholder="请选择菜单图标" default-first-option>
            <el-option label="user" value="el-icon-user">
              <i class="el-icon-user"></i>
              <span class="ml_10">user</span>
            </el-option>
            <el-option label="aim" value="el-icon-aim">
              <i class="el-icon-aim"></i>
              <span class="ml_10">aim</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="menuForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-card>
      <div slot="header">
        <span>菜单列表</span>
        <div class="command fl_r">
          <el-button size="small" type="success" icon="el-icon-menu">添加菜单</el-button>
        </div>
      </div>
      <el-table stripe row-key="id" :data="tableData" :tree-props="{children: 'children'}" v-loading="isTableLoading">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="icon" label="图标" width="120" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon" style="font-size: 16px"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="path" label="路径" width="120"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column width="300" align="right">
          <template slot="header" slot-scope="scope">
            <el-input clearable size="small" prefix-icon="el-icon-menu" placeholder="输入菜单名称搜索" v-model.trim="menuName" @focus="getSearch"></el-input>
          </template>
          <template slot-scope="scope">
            <el-button class="mr_10" size="mini" type="warning" icon="el-icon-edit" @click="handleEditMenu(scope.row)">编辑</el-button>
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
import { getMenuList } from "@/api/menu"

export default {
  name: 'MenuView',
  data() {
    return {
      tableData: [],
      menuName: '',
      isTableLoading: false,
      menuDialogVisible: false,
      menuForm: {
        id: null,
        name: '',
        icon: '',
        path: '',
        description: ''
      }
    }
  },
  created() {
    this.loadMenu()
  },
  methods: {
    showMsg(message, type = 'warning') {
      this.$message({message, type, showClose: true})
    },
    handleRowDel(id) {

    },
    handleEditMenu(menu) {
      this.menuDialogVisible = true
      Object.assign(this.menuForm, menu)
      console.log(this.menuForm)
    },
    saveMenu() {
      console.log(this.menuForm)
    },
    getSearch() {
      console.log('in', this.menuName.length)
    },
    async loadMenu() {
      this.isTableLoading = true
      try {
        const res = await getMenuList()
        if (res.code === 200) {
          this.tableData = res.data
        } else this.showMsg(res.msg)
      } catch (e) {
        this.showMsg(e.message, 'error')
      } finally {
        this.isTableLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.menu_container {
}
</style>