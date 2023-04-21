<template>
  <section class="menu_container">
    <el-dialog width="600px" title="菜单信息" :visible.sync="menuDialogVisible" :before-close="handleDialogClose">
      <el-form style="padding: 0 30px 0" label-position="left" label-width="70px" :model="menuForm">
        <el-form-item label="名称">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-select v-model="menuForm.pid">

          </el-select>
        </el-form-item>
        <el-form-item>
          <div slot="label">
            <span class="mr_5">图标</span>
            <i :class="menuForm.icon ?? 'el-icon-s-opportunity'"></i>
          </div>
          <el-select v-model="menuForm.icon" filterable clearable placeholder="请选择菜单图标" default-first-option>
            <el-option v-for="dict in iconList" :key="dict.name" :label="dict.name" :value="dict.value">
              <i :class="dict.value"></i>
              <span class="ml_10">{{ dict.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="menuForm.description"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menuForm.ordered"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-card>
      <div slot="header">
        <span>菜单列表</span>
        <div class="command fl_r">
          <el-button size="small" type="success" icon="el-icon-menu" @click="menuDialogVisible = true">添加菜单</el-button>
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
        <el-table-column prop="ordered" label="排序" width="80"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column width="300" align="right">
          <template slot="header" slot-scope="scope">
            <el-input clearable size="small" prefix-icon="el-icon-menu" placeholder="输入菜单名称搜索" v-model.trim.lazy="menuName" @input="loadMenu"></el-input>
          </template>
          <template slot-scope="scope">
            <el-button v-if="!scope.row.pid && !scope.row.path" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="addChildNode(scope.row.id)">新增子菜单</el-button>
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
import { throttle } from 'lodash'
import { ShowMsg } from "@/utils/common"
import { getMenuList, searchMenu, updateMenu, addMenu, deleteMenu, getDictIcon } from "@/api/menu"

export default {
  name: 'MenuView',
  data() {
    return {
      tableData: [],
      iconList: [],
      menuForm: {},
      menuName: '',
      isTableLoading: false,
      menuDialogVisible: false,
      addOrUpdate: true
    }
  },
  created() {
    this.loadMenu()
    this.loadIconList()
  },
  methods: {
    async handleRowDel(id) {
      try {
        const res = await deleteMenu(id)
        if (res.code === 200) {
          ShowMsg('菜单删除成功', 'success')
          this.loadMenu()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleEditMenu(menu) {
      this.addOrUpdate = false
      this.menuDialogVisible = true
      this.menuForm = {...menu}
    },
    handleDialogClose() {
      this.addOrUpdate = true
      this.menuDialogVisible = false
      this.menuForm = {}
    },
    addChildNode(pid) {
      this.menuDialogVisible = true
      this.menuForm = {}
      if (pid) {
        this.menuForm.pid = pid
      }
    },
    async loadIconList() {
      try {
        const res = await getDictIcon()
        if (res.code === 200) {
          this.iconList = res.data
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async saveMenu() {
      try {
        const res = this.addOrUpdate ? await addMenu(this.menuForm): await updateMenu(this.menuForm)
        if (res.code === 200) {
          ShowMsg('菜单信息更新成功', 'success')
          this.handleDialogClose()
          this.loadMenu()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    loadMenu: throttle(async function() {
      this.isTableLoading = true
      try {
        const res = this.menuName? await searchMenu({name: this.menuName}): await getMenuList()
        if (res.code === 200) {
          this.tableData = res.data ?? []
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isTableLoading = false
      }
    }, 300)
  }
}
</script>

<style lang="less">
.menu_container {
}
</style>