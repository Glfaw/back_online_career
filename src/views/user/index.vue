<template>
  <section class="user_container">
    <loading-wrapper :isLoading="true" :label="loadingLabel" />
    <el-row class="user_header" :gutter="20">
      <!-- 搜索区 -->
      <el-col :span="5">
        <el-card class="card_search">
          <span class="title" slot="header">搜索用户</span>
          <el-form
            class="user_search"
            :model="formSearch"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                clearable
                maxlength="12"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                v-model.trim="formSearch.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input
                clearable
                maxlength="12"
                prefix-icon="el-icon-phone"
                placeholder="请输入手机号"
                v-model.number="formSearch.phone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                clearable
                maxlength="12"
                prefix-icon="el-icon-location"
                placeholder="请输入居住地址"
                v-model.trim="formSearch.address"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btn">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleUserSearch"
                >搜索</el-button>
                <el-button
                  icon="el-icon-refresh"
                  @click="resetSearch"
                >重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <!-- 编辑 or 修改区 -->
        <el-card class="card_dialog">
          <div slot="header">
            <span class="title">{{ isInsertOrUpdate? '新增用户': '编辑用户' }}</span>
            <div class="fl_r command">
              <el-button v-if="isInsertOrUpdate" class="add" size="mini" type="primary" icon="el-icon-circle-plus" @click="handleInsert">添加</el-button>
              <el-button v-if="!isInsertOrUpdate" class="save" size="mini" type="warning" icon="el-icon-notebook-2" @click="handleUpdate">保存</el-button>
              <el-button v-if="!isInsertOrUpdate" class="cancel" size="mini" icon="el-icon-close" @click="dialogInit">取消</el-button>
            </div>
          </div>
          <el-form class="dialog" label-width="60px" label-position="left" :model="formDialog">
            <el-row :gutter="40">
              <!-- 左侧 -->
              <el-col class="left" :span="9">
                <el-form-item label="头像" style="height: 75px">
                  <el-upload
                    class="avatar-uploader"
                    :class="{avatar_border: isInsertOrUpdate}"
                    :show-file-list="false"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    @on-change="handleChangeAvatar"
                  >
                    <el-avatar
                      v-if="formDialog.avatarUrl"
                      fit="contain"
                      shape="square" 
                      :size="60" 
                      :src="formDialog.avatarUrl"
                    ></el-avatar>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <span v-if="formDialog.avatarUrl" class="tip">修改</span>
                  </el-upload>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio v-model="formDialog.gender" :label="1">男</el-radio>
                  <el-radio v-model="formDialog.gender" :label="0">女</el-radio>
                </el-form-item>
                <el-form-item label="学历">
                  <el-select size="mini" placeholder="请选择学历" v-model="formDialog.degree">
                    <el-option label="专科及以下" :value="0"></el-option>
                    <el-option label="本科" :value="1"></el-option>
                    <el-option label="硕士" :value="2"></el-option>
                    <el-option label="博士及以上" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="角色">
                  <el-select size="mini" placeholder="请选择用户角色" v-model="formDialog.roleId" @change="dialogRoleChange">
                    <el-option label="超级管理员" :value="1"></el-option>
                    <el-option label="管理员" :value="2"></el-option>
                    <el-option label="求职者" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="企业">
                  <el-select filterable clearable size="mini" placeholder="请选择所属企业" v-model="formDialog.firmId" :disabled="formDialog.roleId != 2">
                    <el-option
                      v-for="item in allFirms"
                      :key="item.id"
                      :label="`${item.id}, ${item.type}, ${item.designation}`"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 右侧 -->
              <el-col class="right" :span="15">
                <el-row :gutter="20">
                  <el-col :span="12" v-if="!isInsertOrUpdate">
                    <el-form-item label="用户ID">
                      <el-input prefix-icon="el-icon-s-custom" v-model="formDialog.id" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="isInsertOrUpdate? 24: 12">
                    <el-form-item label="用户名">
                      <el-input clearable prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="formDialog.name" :disabled="!isInsertOrUpdate"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="年龄">
                      <el-input prefix-icon="el-icon-date" maxlength="2" placeholder="请输入年龄" v-model.number="formDialog.age"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电话">
                      <el-input clearable maxlength="11" prefix-icon="el-icon-phone" placeholder="请输入手机号" v-model="formDialog.phone"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="邮箱">
                  <el-input clearable prefix-icon="el-icon-message" placeholder="请输入邮箱" v-model="formDialog.email"></el-input>
                </el-form-item>
                <el-form-item label="住址">
                  <el-input clearable prefix-icon="el-icon-location" placeholder="请输入居住地址" v-model="formDialog.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="7">
        <!-- 时间卡片 -->
        <el-card class="card_time">
          <span class="title" slot="header">当前时间</span>
          <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-card>

        <!-- 功能区 -->
        <el-card class="card_func mt_10">
          <span class="title" slot="header">更多功能</span>
          <div class="func_area">
            <el-popconfirm title="是否执行批量删除?" cancel-button-text='我再想想' @confirm="handleRowsDel">
              <el-button
                type="danger"
                slot="reference"
                icon="el-icon-remove"
                :disabled="!seletionIds.length"
              >批量删除</el-button>
            </el-popconfirm>
            <el-upload
              accept=".xlsx"
              action=""
              :show-file-list="false"
              :http-request="handleUploadImport"
            >
              <el-button type="info" class="ml_10 mr_10" icon="el-icon-download">导入</el-button>
            </el-upload>
            <el-button type="warning" icon="el-icon-upload2">导出</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据列表 -->
    <el-card class="card_tableData mt_20">
      <div class="card_header" slot="header">
        <span class="title">数据列表</span>
        <!-- 我的分页 -->
        <el-pagination
          class="fl_r"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="total < pageSize"
        ></el-pagination>
      </div>
      

      <!-- 表格数据 -->
      <el-table stripe class="user_table" header-cell-class-name="user_table_header" :data="tableData" @selection-change="handleSelectChange">
        <el-table-column fixed type="selection" width="50" align="center"></el-table-column>
        <el-table-column fixed prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="name" label="用户名" width="120"></el-table-column>
        <el-table-column prop="account" label="账号" width="120"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80">
          <template v-slot="scope">
            <span>{{scope.row.gender? '男': '女'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="50"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="firm.designation" label="所属企业" width="150"></el-table-column>
        <el-table-column prop="address" label="住址"></el-table-column>
        <el-table-column label="角色" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.roleId">
              {{allRoles.find(v => v.id == scope.row.roleId).name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button class="mr_10" icon="el-icon-edit" type="success" size="mini" @click="dialogUpdate(scope.row)">编辑</el-button>
            <el-popconfirm title="确定要删除吗" @confirm="handleRowDel(scope.row)">
              <el-button slot="reference" icon="el-icon-remove-outline" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import LoadingWrapper from '@/components/loading_wrapper'
import { mapState } from 'vuex'
// 引入节流防抖，为用户自定义搜索节流、导出excel防抖
import { debounce, throttle } from 'lodash'
import { uploadExcelImport, uploadExcelExport } from '@/api/upload'
import { addUser, deleteUserByID, getPagination, updateUser, deleteUserBySelect } from "@/api/user"

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
        gender: 1,
        age: 20,
        degree: 1,
        phone: null,
        email: null,
        address: null,
        avatarUrl: null,
        firmId: null,
        roleId: 3
      },
      tableData: [],
      seletionIds: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loadingLabel: '',
      isLoading: false,
      isInsertOrUpdate: true,
    };
  },
  components: { LoadingWrapper },
  created() {
    this.getSearch();
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
    
    handleChangeAvatar(file, fileList) {
      console.log(file, fileList);
    },
    handleUploadAvatar() {

    },
    handleNotify(title, message, type='info') {
      this.$notify({ type, title, message, position: 'bottom-right' })
    },
    // 节流：频繁点击每隔时间用户搜索
    handleUserSearch: throttle(function() { this.getSearch() }, 500, {leading: true}),
    // 防抖：3秒内只执行一次【导出】,先执行后等待
    // handleExport: debounce(function() {
    //   window.open(excelExport)
    //   this.handleNotify('文件导出成功', '已成功导出数据为Excel文件', 'success')
    // }, 3000, {leading: true}),
    // 导入
    // handleExcelImport: throttle(function(res) {
    //   if(typeof res == 'boolean' && res) {
    //     this.handleNotify('文件导入成功', '已成功导入Excel文件数据', 'success')
    //     this.getSearch()
    //   } else if (res.code == 300) {
    //     this.handleNotify('文件导入失败', `${res.msg}`, 'error')
    //   }
    // }, 500),
    // 初始化表单
    dialogInit() {
      for (const key in this.formDialog) {
        this.formDialog[key] = null
      }
      this.formDialog.roleId = 3;
      this.formDialog.age = 20;
      this.formDialog.degree = this.formDialog.gender = 1;
      this.isInsertOrUpdate = true
    },
    // 表单角色发生变化时，按情况清空企业id
    dialogRoleChange(role) {
      if(role != 2) {
        this.formDialog.firmId = null
      }
    },
    // 点击【编辑】，切换表单模式
    dialogUpdate(row) {
      Object.assign(this.formDialog, row)
      this.isInsertOrUpdate = false
    },
    // 执行【新增】
    async handleInsert() {
      try {
        const res = await addUser(this.formDialog);
        if(res.code == 200) {
          this.showMsg('添加成功', 'success');
          this.dialogInit();
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
          this.dialogInit();
          this.getSearch();
        }
        else this.showMsg(res.msg, 'error')
      } catch (error) {
        this.showMsg(error.message, 'error')
      }
    },
    // 执行【删除】
    async handleRowDel(row) {
      if(this.formDialog.id == row.id) this.dialogInit()
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
      if(this.seletionIds.includes(this.formDialog.id)) this.dialogInit()
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
    // 执行导入
    async handleUploadImport({file}) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadExcelImport(formData)
        if(res.code == 200) {
          console.log(res.data);
        } else this.showMsg(res.msg)
      } catch (error) {
        console.log(error.message);        
      }
    },

    // 执行【分页】
    async getSearch() {
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
    },
  },
};
</script>

<style lang="less">
.user_container {
  .user_header {
    display: flex;

    .card_search, .card_dialog {
      height: 100%;
    }
  }

  .card_search {
    .user_search {
      .el-form-item__label {
        font-size: 15px;
      }

      .btn {
        display: flex;
        justify-content: flex-end;

        button {
          flex: 1;
        }
      }
    }
  }

  .card_dialog {
    .dialog {
      .avatar-uploader .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 60px;
        height: 60px;

        .tip {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          line-height: 60px;
          color: #e4e4e4;
          background-color: rgba(0, 0, 0, .3);
        }

        &:hover .tip {
          display: block;
        }
      }

      .avatar_border .el-upload {
        border: 1px dashed #d9d9d9;
      }

      .avatar_border .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 18px;
        color: #8c939d;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }


      .left {
        border-right: 1px solid #eee;
        .el-form-item {
          margin-bottom: 5px;
        }
      }

      .right {

        .el-form-item {
          margin-bottom: 22px;
        }
      }
    }
  }
  
  .card_func {
    .func_area {
      display: flex;
    }
  }

  .card_tableData {
    .card_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
    }

    .user_table {
      &::before {
        display: none;
      }

      .user_table_header {
        // color: #fff;
        background-color: #f3f5f7 !important;
      }
    }
  }

}
</style>