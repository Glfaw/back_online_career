<template>
  <div class="user_container">
    <el-form
      class="user_form"
      label-position="top"
      :inline="true"
      :model="formSearch"
      @submit.native.prevent>
      <el-form-item>
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-user"
          placeholder="请输入用户名"
          v-model.trim="formSearch.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-mobile"
          placeholder="请输入手机号"
          v-model.number="formSearch.phone"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-position"
          placeholder="请输入居住地址"
          v-model.trim="formSearch.address"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleUserSearch"
          >搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
      </el-form-item>
      <div class="func_area">
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="dialogInsert">新增</el-button>
        <el-popconfirm class="ml_10 mr_10" title="是否执行批量删除?" cancel-button-text='我再想想' @confirm="handleRowsDel">
          <el-button slot="reference" size="small" type="danger" icon="el-icon-remove"
            :disabled="!seletionIds.length"
          >批量删除</el-button>
        </el-popconfirm>
        <el-button size="small" type="info" icon="el-icon-download">导入</el-button>
        <el-button size="small" type="warning" icon="el-icon-upload2" @click="handleExport">导出</el-button>
      </div>
    </el-form>

    <!-- 新增dialog -->
    <el-dialog width="800px" title="用户信息" :visible.sync="dialogFormVisible" @closed="dialogClosed">
      <el-form inline label-width="80px" :model="formDialog">
        <el-form-item v-if="isFormToUpdate" label="用户ID">
          <el-input v-model="formDialog.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formDialog.name" autocomplete="off" :disabled="isFormToUpdate"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="formDialog.age" maxlength="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教育程度">
          <el-select v-model="formDialog.degree" placeholder="请选择学历">
            <el-option label="专科及以下" :value="0"></el-option>
            <el-option label="本科" :value="1"></el-option>
            <el-option label="硕士" :value="2"></el-option>
            <el-option label="博士及以上" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formDialog.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formDialog.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="formDialog.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="formDialog.roleId" placeholder="请选择用户角色">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="求职者" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属企业" v-if="formDialog.roleId == 2">
          <el-select v-model="formDialog.firmId" placeholder="请选择所属公司">
            <el-option label="请选择" :value="null"></el-option>
            <el-option v-for="item in allFirms" :key="item.id" :label="`${item.id}, ${item.type}, ${item.designation}`" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogInsertOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格数据 -->
    <el-table border stripe class="user_table" header-cell-class-name="user_table_header" :data="tableData" @selection-change="handleSelectChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column label="角色" width="120">
        <template v-slot="scope">
          <span v-if="scope.row.roleId">
            {{allRoles.find(v => v.id == scope.row.roleId).name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" width="150"></el-table-column>
      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="firm.designation" label="所属企业" width="150"></el-table-column>
      <el-table-column prop="address" label="住址"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button class="mr_10" icon="el-icon-edit" type="success" size="mini" @click="dialogUpdate(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗" @confirm="handleRowDel(scope.row)">
            <el-button slot="reference" icon="el-icon-remove-outline" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 我的分页 -->
    <el-pagination
      class="user_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
// 引入节流防抖，为用户自定义搜索节流、导出excel防抖
import { debounce, throttle } from 'lodash'
import { mapState } from 'vuex'
import {
  addUser, deleteUserByID, getPagination, updateUser,
  deleteUserBySelect, exportByExcel
} from "@/api/user";

export default {
  name: "UserView",
  data() {
    return {
      formSearch: {
        username: "",
        address: "",
        phone: "",
      },
      formDialog: {
        id: null,
        name: null,
        age: 20,
        degree: 1,
        phone: null,
        email: null,
        address: null,
        firmId: null,
        roleId: 3
      },
      tableData: [],
      seletionIds: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      isFormToUpdate: false,
      isFormToInsert: false
    };
  },
  created() {
    if(this.user) {
      this.getSearch();
    } else this.showMsg('请先登录账号', 'error')
  },
  computed: {
    ...mapState(['user', 'allRoles', 'allFirms']),
  },
  methods: {
    showMsg(message, type='warning') {
      this.$message({ type, message, showClose: true })
    },
    resetSearch() {
      this.formSearch.username = this.formSearch.address = this.formSearch.phone = null;
      this.handleUserSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleUserSearch()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleUserSearch()
    },
    handleSelectChange(list) {
      this.seletionIds = [...list.map(v => v.id)];
    },
    // 节流：频繁点击每隔时间用户搜索
    handleUserSearch: throttle(function() { this.getSearch() }, 500),
    // 防抖：3秒内只执行一次【导出】,先执行后等待
    handleExport: debounce(() => window.open(exportByExcel), 3000, {leading: true}),
    // 关闭表单窗口
    dialogClosed() {
      for (const key in this.formDialog) {
        this.formDialog[key] = null
      }
      this.formDialog.roleId = 3;
      this.formDialog.age = 20;
      this.formDialog.degree = 1;
      this.isFormToInsert = this.isFormToUpdate = false;
    },
    // 通过【新增用户】打开表单窗口
    dialogInsert() {
      this.dialogFormVisible = this.isFormToInsert = true;
    },
    // 通过【编辑】打开表单窗口
    dialogUpdate(row) {
      this.dialogFormVisible = this.isFormToUpdate = true
      this.formDialog = {...row}
    },
    // 判断点击确定是【新增】还是【修改】
    dialogInsertOrUpdate() {
      if(this.formDialog.roleId != 2) this.formDialog.firmId = null
      this.isFormToInsert? this.handleInsert(): this.handleUpdate();
      this.dialogFormVisible = false;
    },
    // 执行【新增】
    async handleInsert() {
      try {
        const res = await addUser(this.formDialog);
        if(res.code == 200) {
          this.showMsg('添加成功', 'success');
          this.getSearch();
        }
        else this.showMsg(res.msg, 'error')
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    },
    // 执行【修改】
    async handleUpdate() {
      try {
        const res = await updateUser(this.formDialog);
        if(res.code == 200) {
          this.showMsg('修改成功', 'success');
          this.getSearch();
        }
        else this.showMsg(res.msg, 'error')
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    },
    // 执行【删除】
    async handleRowDel(row) {
      try {
        const res = await deleteUserByID(row.id);
        if(res.code == 200) {
          this.showMsg('删除成功', 'success')
          this.getSearch()
        }
        else this.showMsg(res.msg, 'error')
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    },
    // 执行【批量删除】
    async handleRowsDel() {
      console.log(this.seletionIds);
      try {
        const res = await deleteUserBySelect(this.seletionIds);
        if(res.code == 200) {
          this.showMsg('批量删除成功', 'success');
          this.getSearch();
        }
        else this.showMsg(res.msg, 'error')
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    },
    // 执行【分页】
    async getSearch() {
      if (this.user) {
        try {
          const res = await getPagination({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            username: this.formSearch.username,
            address: this.formSearch.address,
            phone: this.formSearch.phone
          });
          if(res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        } catch (error) {
          this.showMsg(error.message, 'error')
        }
      }
    },
  },
};
</script>

<style lang="less">
.user_container {
  .user_form {
    margin-top: 15px;

    .el-form-item__label {
      font-size: 15px;
    }

    .el-input {
      margin-right: 10px;
      width: 200px;
    }
  }

  .func_area {
    margin-bottom: 50px;
  }

  .user_table {
    .user_table_header {
      background-color: #f3f5f7 !important;
    }
  }

  .user_pagination {
    margin-top: 50px;
  }
}
</style>