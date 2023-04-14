<template>
  <section class="role_container">
    <!--  添加角色  -->
    <el-dialog width="500px" title="角色信息" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form label-position="left" label-width="80px" :model="dialogForm">
        <el-form-item label="角色名称">
          <el-input clearable prefix-icon="el-icon-s-custom" placeholder="角色名称" v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input clearable prefix-icon="el-icon-s-flag" placeholder="角色标识" v-model="dialogForm.flag"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input clearable prefix-icon="el-icon-info" placeholder="角色描述" v-model="dialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleRoleForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  分配菜单  -->


    <el-row :gutter="20">
      <el-col :span="6">
        <el-card header="搜索角色">
          <el-form :model="formSearch">
            <el-form-item>
              <el-input clearable prefix-icon="el-icon-s-custom" placeholder="角色名称" v-model="formSearch.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input clearable prefix-icon="el-icon-s-flag" placeholder="角色标识" v-model="formSearch.flag"></el-input>
            </el-form-item>
            <div class="handle">
              <el-button type="primary" icon="el-icon-search" @click="loadTable">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </div>
            <el-divider>或者</el-divider>
            <div class="handle">
              <el-button type="success" icon="el-icon-s-custom" @click="dialogVisible = true">添加角色</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card header="角色列表">
          <el-table border stripe header-cell-class-name="table_header" v-loading="isTableLoading" :data="tableData">
            <el-table-column fixed prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="flag" label="角色标识" width="200"></el-table-column>
            <el-table-column prop="description" label="角色描述"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button type="info" size="mini" icon="el-icon-menu">分配菜单</el-button>
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
import { debounce, throttle } from 'lodash'
import { getSearchRoles, addRole, updateRole, deleteRole } from "@/api/role";

export default {
  name: 'RoleView',
  data() {
    return {
      formSearch: {
        name: '',
        flag: ''
      },
      dialogForm: {
        name: '',
        flag: '',
        description: ''
      },
      tableData: [],
      addOrUpdate: false,
      dialogVisible: false,
      isTableLoading: false,
    }
  },
  created() {
    if (this.user && this.user.token) {
      this.loadTable()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    showMsg(message, type = 'warning') {
      this.$message({ type, message, showClose: true })
    },
    resetForm() {
      this.formSearch.name = this.formSearch.flag = ''
      this.loadTable()
    },
    handleClose() {
      this.dialogVisible = this.addOrUpdate = false
      this.dialogForm.name = this.dialogForm.flag = this.dialogForm.description = ''
    },
    handleRowUpdate(row) {
      this.dialogVisible = this.addOrUpdate = true;
      Object.assign(this.dialogForm, row);
    },
    async handleRowDel(id) {
      try {
        const res = await deleteRole(id)
        if (res.code === 200) {
          this.showMsg('删除成功', 'success')
          this.loadTable()
          this.$store.dispatch('loadRoles');
        } else this.showMsg(res.msg)
      } catch (e) {
        this.showMsg(e.message, 'error')
      }
    },
    async handleRoleForm() {
      try {
        const flag = this.addOrUpdate
        const res = flag? await updateRole(this.dialogForm): await addRole(this.dialogForm)
        if (res.code === 200) {
          this.handleClose()
          this.showMsg(flag? '修改角色信息成功': '添加角色成功', 'success')
          this.loadTable()
          this.$store.dispatch('loadRoles');
        } else this.showMsg(res.msg)
      } catch (e) {
        this.showMsg(e.message, 'error')
      }
    },
    loadTable: throttle(async function() {
      this.isTableLoading = true;
      try {
        const res = await getSearchRoles({
          name: this.formSearch.name,
          flag: this.formSearch.flag
        })
        if (res.code === 200) {
          this.tableData = res.data
        } else this.showMsg(res.msg)
      } catch (e) {
        this.showMsg(e.message, 'error')
      } finally {
        this.isTableLoading = false
      }
    }, 500, { leading: true })
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