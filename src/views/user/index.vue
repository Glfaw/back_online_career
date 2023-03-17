<template>
  <div class="user_container">
    <el-form
      class="user_form"
      label-position="top"
      :inline="true"
      :model="form"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item prop="username">
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-user"
          placeholder="请输入用户名"
          v-model.trim="form.uname"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-mobile"
          placeholder="请输入手机号"
          v-model.number="form.phone"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          size="small"
          maxlength="12"
          prefix-icon="el-icon-position"
          placeholder="请输入居住地址"
          v-model.trim="form.address"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="getSearch"
          >搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
      </el-form-item>
      <div>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          >新增</el-button
        >
        <el-button size="small" type="danger" icon="el-icon-remove-outline"
          >批量删除</el-button
        >
        <el-button size="small" type="info" icon="el-icon-download"
          >导入</el-button
        >
        <el-button size="small" type="warning" icon="el-icon-upload2"
          >导出</el-button
        >
      </div>
    </el-form>

    <el-table class="user_table" :data="tableData" border stripe>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column label="角色" width="120">
        <template v-slot="scope">
          <span v-if="scope.row.roleId">
            {{roles.find(v => v.id == scope.row.roleId).name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="info.name" label="用户名" width="150"></el-table-column>
      <el-table-column prop="info.account" label="账号" width="150"></el-table-column>
      <el-table-column prop="info.phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="info.email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="firm.designation" label="所属公司" width="150"></el-table-column>
      <el-table-column prop="info.address" label="住址"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="user_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getRoleList, getAllUser, getSearchPagination } from "@/api/user";

export default {
  name: "UserView",
  data() {
    return {
      form: {
        uname: "",
        address: "",
        phone: "",
      },
      rules: {
        phone: [{type: 'number', message: '请输入手机号'}]
      },
      roles: [],
      tableData: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
    };
  },
  created() {
    this.getRoles();
    this.getUserList();
  },
  computed: {
    searchFlag() {
      let searchKey = [this.form.uname, this.form.phone, this.form.address];
      return searchKey.some((item) => item);
    },
    searchParam() {
      let key = Object.keys(this.form);
      let value = Object.values(this.form);
      let obj = new Map();

      value.filter((item, index) => {
        if (item != '') {
          obj.set(key[index], value[index]);
        }
      })

      return obj;
    }
  },
  methods: {
    resetSearch() {
      this.form = {};
      this.getUserList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(row) {
      console.log(row);
    },
    async getRoles() {
      try {
        const { data } = await getRoleList();
        console.log(data);
        if(data.code == 200) {
          this.roles = data.data;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async getUserList() {
      try {
        const { data } = await getAllUser();
        console.log(data);
        if(data.code == 200) {
          this.tableData = data.data;
          this.total = this.tableData.length;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async getSearch() {
      if (this.searchFlag) {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };

        for (const v of this.searchParam) {
          params[v[0]] = v[1];
        }

        try {
          const { data } = await getSearchPagination(params);
          console.log(data);
          if(data.code == 200) {
            // console.log(data, data.data);
            this.tableData = data.data.records;
            this.total = data.data.total;
          }
        } catch (error) {
          console.log(error.message);
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

  .user_table {
    margin-top: 50px;
  }

  .user_pagination {
    margin-top: 50px;
  }
}
</style>