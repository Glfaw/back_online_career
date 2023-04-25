<template>
  <section class="role_container">
    <!--  添加角色  -->
    <el-dialog width="450px" title="角色信息" :visible.sync="roleDialogVisible" :before-close="roleDialogClose">
      <el-form label-position="left" label-width="50px" :model="dialogForm">
        <el-form-item label="名称">
          <el-input clearable prefix-icon="el-icon-s-custom" placeholder="角色名称" v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标识">
          <el-input clearable prefix-icon="el-icon-s-flag" placeholder="角色标识" v-model="dialogForm.flag"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input clearable prefix-icon="el-icon-info" placeholder="角色描述" v-model="dialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleRoleForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  分配菜单  -->
    <el-dialog width="450px" title="分配菜单" :visible.sync="menuDialogVisible" :before-close="menuDialogClose">
      <el-tree
        show-checkbox
        check-strictly
        ref="menuTree"
        node-key="id"
        :data="menuData"
        :props="defaultProp"
        :default-expanded-keys="expendMenu"
        @check="interLock">
        <div slot-scope="{ node, data }">
          <i :class="data.icon"></i>
          <span class="ml_5">{{ data.name }}</span>
        </div>
      </el-tree>

      <div slot="footer">
        <el-button @click="menuDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleSaveMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" header="搜索角色">
          <el-form :model="formSearch">
            <el-form-item>
              <el-input clearable prefix-icon="el-icon-s-custom" placeholder="角色名称" v-model="formSearch.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input clearable prefix-icon="el-icon-s-flag" placeholder="角色标识" v-model="formSearch.flag"></el-input>
            </el-form-item>
            <div class="handle">
              <el-button type="primary" icon="el-icon-search" @click="loadRoleTable">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </div>
            <el-divider>或者</el-divider>
            <div class="handle">
              <el-button type="success" icon="el-icon-s-custom" @click="roleDialogVisible = true">添加角色</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never" header="角色列表">
          <el-table border stripe header-cell-class-name="table_header" v-loading="isTableLoading" :data="tableData">
            <el-table-column fixed prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="flag" label="角色标识" width="200"></el-table-column>
            <el-table-column prop="description" label="角色描述"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button type="info" size="mini" icon="el-icon-menu" @click="divideMenu(scope.row.id)">分配菜单</el-button>
                <el-button class="mr_10" type="warning" size="mini" icon="el-icon-edit" @click="handleRowUpdate(scope.row)">编辑</el-button>
                <el-popconfirm title="确定要删除吗" @confirm="handleRowDel(scope.row.id)">
                  <el-button slot="reference" type="danger" size="mini" icon="el-icon-remove-outline">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { getMenuList } from "@/api/menu"
import { debounce, throttle } from 'lodash'
import { ShowMsg, LoadingWrapper } from "@/utils/common"
import { getSearchRoles, addRole, updateRole, deleteRole, getRoleMenu, divideRoleMenu } from "@/api/role";

export default {
  name: 'RoleView',
  data() {
    return {
      defaultProp: {
        children: 'children',
        label: 'name'
      },
      formSearch: {},
      dialogForm: {},
      tableData: [],
      menuData: [],
      expendMenu: [],
      divideRoleId: null,
      addOrUpdate: false,
      roleDialogVisible: false,
      menuDialogVisible: false,
      isTableLoading: false,
    }
  },
  created() {
    if (this.user && this.user.token) {
      this.loadRoleTable()
      this.loadMenuList()
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    resetForm() {
      this.formSearch = {}
      this.loadRoleTable()
    },
    roleDialogClose() {
      this.roleDialogVisible = this.addOrUpdate = false
      this.dialogForm = {}
    },
    menuDialogClose() {
      this.menuDialogVisible = false
      this.divideRoleId = null
      this.$refs.menuTree.setCheckedKeys([])
    },
    handleRowUpdate(row) {
      this.roleDialogVisible = this.addOrUpdate = true;
      this.dialogForm = {...row}
    },
    interLock({id, pid, children}, {checkedKeys}) {
      if (pid && !checkedKeys.includes(pid)) {
        checkedKeys.push(pid)
      } else {
        if (children && !checkedKeys.includes(id)) {
          const childIds = children.map(v => v.id)
          checkedKeys = checkedKeys.filter(v => !(new Set(childIds).has(v)))
        }
      }
      this.$refs.menuTree.setCheckedKeys(checkedKeys)
    },
    // 打开分配菜单对话框
    divideMenu: debounce(function(roleId) {
      this.menuDialogVisible = true
      this.divideRoleId = roleId

      // 获取对应角色的菜单id
      this.$nextTick(this.handleGetRoleMenu)
    }, 300, { leading: true }),
    // 绑定指定角色的对应菜单，为角色分配菜单
    async handleSaveMenu() {
      try {
        const list = this.$refs.menuTree.getCheckedKeys()
        const res = await divideRoleMenu(this.divideRoleId, list)
        if (res.code === 200) {
          const tmp = this.divideRoleId
          const {roleId} = this.user
          if (tmp === roleId) this.$emit('refreshRouteMenu')
          this.menuDialogClose()
          ShowMsg('角色菜单分配成功', 'success')
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    // 获取指定角色的对应菜单列表id
    async handleGetRoleMenu() {
      // 生成加载菜单蒙板
      const loadTree = LoadingWrapper({target: this.$refs.menuTree.$el})
      try {
        const res = await getRoleMenu(this.divideRoleId)
        if (res.code === 200) {
          this.$refs.menuTree.setCheckedKeys(res.data)
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        loadTree.close()
      }
    },
    async handleRowDel(id) {
      try {
        const res = await deleteRole(id)
        if (res.code === 200) {
          ShowMsg('删除成功', 'success')
          this.loadRoleTable()
          this.$store.dispatch('loadRoles');
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleRoleForm() {
      try {
        const flag = this.addOrUpdate
        const res = flag? await updateRole(this.dialogForm): await addRole(this.dialogForm)
        if (res.code === 200) {
          this.roleDialogClose()
          ShowMsg(flag? '修改角色信息成功': '添加角色成功', 'success')
          this.loadRoleTable()
          this.$store.dispatch('loadRoles');
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    loadRoleTable: debounce(async function() {
      this.isTableLoading = true;
      try {
        const res = await getSearchRoles(this.formSearch)
        if (res.code === 200) {
          this.tableData = res.data
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isTableLoading = false
      }
    }, 500, { leading: true }),
    loadMenuList: throttle(async function() {
      try {
        const res = await getMenuList()
        if (res.code === 200) {
          this.menuData = res.data
          this.expendMenu = this.menuData.map(m => m.id)
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    }, 300)
  }
}
</script>

<style lang="less">
.role_container {

  .handle {
    display: flex;

    button {
      flex: 1;
    }
  }

  .table_header {
    background-color: #f3f5f7 !important;
  }

  .drawer__content {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    padding: 0 30px 25px;
    height: 100%;

    .drawer__footer {
      display: flex;

      button {
        flex: 1;
      }
    }
  }
}
</style>