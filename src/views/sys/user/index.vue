<template>
  <section class="user_container">
    <el-row :gutter="10">
      <!-- 搜索区 -->
      <el-col :span="6">
        <el-card shadow="never" class="card_search">
          <span class="title" slot="header">搜索用户</span>
          <el-form
            class="user_search"
            :model="formSearch"
            @submit.native.prevent>
            <el-form-item>
              <el-input
                clearable
                maxlength="12"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                v-model.trim="formSearch.username"></el-input>
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
            <el-form-item class="fl_r">
              <el-button size="medium" type="primary" icon="el-icon-search" @click="getSearch">搜索</el-button>
              <el-button size="medium" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <!-- 数据列表 -->
        <el-card shadow="never" class="card_tableData">
          <div slot="header">
            <span>用户列表</span>
            <!-- 我的分页 -->
            <el-pagination
              class="fl_r command"
              :total="total"
              :page-size="pageSize"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20, 50]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>

          <div class="option mb_20">
            <div class="filter">
              <el-cascader
                clearable
                filterable
                size="small"
                icon="el-icon-user"
                placeholder="区域筛选：不限"
                :options="pcTextArr"
                @change="getSearch"
                v-model="formSearch.address">
              </el-cascader>
            </div>
            <div class="func">
              <el-button size="small" icon="el-icon-plus" type="primary" class="mr_10" @click="dialogVisible = true">添加用户</el-button>
              <el-popconfirm title="是否执行批量删除?" cancel-button-text='我再想想' @confirm="handleRowsDel">
                <el-button
                  size="small"
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  :disabled="seletionIds?.length < 2">批量删除</el-button>
              </el-popconfirm>
              <el-upload
                action=""
                accept=".xlsx"
                :show-file-list="false"
                :http-request="handleImport">
                <el-button size="small" type="success" class="ml_10 mr_10" icon="el-icon-download">导入</el-button>
              </el-upload>
              <el-button size="small" type="info" icon="el-icon-upload2" @click="handleExport">导出</el-button>
            </div>
          </div>

          <!-- 表格数据 -->
          <el-table border stripe v-loading="isTableLoading" :data="tableData" @selection-change="handleSelectChange">
            <el-table-column fixed type="selection" width="40"></el-table-column>
            <el-table-column fixed prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="用户名" width="120"></el-table-column>
            <el-table-column prop="account" label="账号" width="120"></el-table-column>
            <el-table-column prop="gender" label="性别" width="80">
              <template v-slot="scope">
                <span>{{ scope.row.gender ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="50"></el-table-column>
            <el-table-column prop="phone" label="电话" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="住址" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.address?.split('#')[0]}} <i class="mr_5" v-if="scope.row.address"></i> {{scope.row.address?.split('#')[1]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" width="100">
              <template v-slot="scope">
                <span v-if="scope.row.roleId">
                  {{ allRoles.find(v => v.id === scope.row.roleId)?.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button class="mr_10" icon="el-icon-edit" type="warning" size="mini" @click="dialogUpdate(scope.row)">编辑</el-button>
                <el-popconfirm title="确定要删除吗" @confirm="handleRowDel(scope.row)">
                  <el-button slot="reference" icon="el-icon-remove-outline" type="danger" size="mini" :disabled="scope.row.roleId === 1">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="用户信息" class="dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <el-form ref="dialog_form" label-position="top" :model="formDialog">
        <el-row :gutter="40">
          <!-- 左侧 -->
          <el-col class="left" :span="9">
            <el-form-item label="头像">
              <el-upload
                action=""
                accept=".jpg, .jpeg, .png"
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeUploadAvatar"
                :http-request="handleUploadAvatar"
                :class="{avatar_border: !formDialog?.avatarUrl}">
                <el-avatar
                  v-if="formDialog.avatarUrl"
                  fit="contain"
                  shape="square"
                  :size="60"
                  :src="formDialog.avatarUrl"></el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span v-if="formDialog.avatarUrl" class="tip">修改</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="formDialog.gender" :label="1">男</el-radio>
              <el-radio v-model="formDialog.gender" :label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="教育程度">
              <el-select placeholder="请选择学历" v-model="formDialog.degree">
                <el-option label="专科及以下" :value="0"></el-option>
                <el-option label="本科" :value="1"></el-option>
                <el-option label="硕士" :value="2"></el-option>
                <el-option label="博士及以上" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户角色">
              <el-select placeholder="请选择用户角色" v-model="formDialog.roleId" @change="dialogRoleChange">
                <el-option v-for="item in allRoles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属企业">
              <el-select filterable default-first-option clearable placeholder="请选择所属企业"
                         v-model="formDialog.firmId" :disabled="formDialog.roleId != 2">
                <el-option
                  v-for="item in allFirms"
                  :label="`${item.name}（ID: ${item.id}）`"
                  :key="item.id"
                  :value="item.id">
                  <span class="fl_l">{{item.name}}</span>
                  <span class="fl_r">ID: {{item.id}}</span>
                </el-option>
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
                  <el-input clearable prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="formDialog.name"></el-input>
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
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-cascader
                    clearable
                    filterable
                    icon="el-icon-user"
                    style="width: 100%;"
                    placeholder="请选择省、市、区"
                    :options="pcaTextArr"
                    v-model="formDialog.area">
                  </el-cascader>
                </el-col>
                <el-col :span="12">
                  <el-input clearable prefix-icon="el-icon-location" placeholder="请输入详细地址" v-model="formDialog.location"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="medium" type="info" @click="dialogClose">取消</el-button>
        <el-button size="medium" type="primary" @click="handleFormSubmit">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import {pcTextArr, pcaTextArr} from 'element-china-area-data'
// 引入节流防抖，为用户自定义搜索节流、导出excel防抖
import {debounce, throttle} from 'lodash'
import {ShowMsg, ShowNotify, LoadingWrapper} from "@/utils/common"
import {uploadUserAvatar, impUser, expUser} from '@/api/upload'
import {addUser, deleteUserByID, getPagination, updateUser, deleteUserBySelect} from "@/api/user"

export default {
  name: "UserView",
  data() {
    return {
      formSearch: {},
      formDialog: {},
      tableData: [],
      seletionIds: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      isTableLoading: false,
      isInsertOrUpdate: true,
      pcaTextArr,
      pcTextArr
    };
  },
  created() {
    this.getSearch();
  },
  computed: {
    ...mapState(['user', 'allRoles', 'allFirms'])
  },
  methods: {
    handleNotify(title, message, type = 'warning') {
      this.$notify({type, title, message, position: 'bottom-right'})
    },
    resetSearch() {
      this.formSearch = {}
      this.getSearch()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSearch()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getSearch()
    },
    handleSelectChange(list) {
      this.seletionIds = list.map(v => v.id)
    },
    // 初始化表单
    dialogClose() {
      this.formDialog = {}
      this.dialogVisible = false
      this.isInsertOrUpdate = true
    },
    // 表单角色发生变化时，按情况清空企业id
    dialogRoleChange(role) {
      if (role !== 2) {
        this.formDialog.firmId = null
      }
    },
    // 点击【编辑】，切换表单模式
    dialogUpdate(row) {
      this.dialogVisible = true
      this.isInsertOrUpdate = false

      this.formDialog = {
        area: row.address? row.address.split('#')[0]?.split(','): [],
        location: row.address? row.address.split('#')[1]: '',
        ...row
      }
    },
    beforeUploadAvatar(file) {
      const isType = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = (file.size / 1024 / 1024) < 2;
      if (!isType) ShowMsg('图片类型只能是jpeg/png格式')
      if (!isLt2M) ShowMsg('上传图片大小不能超过2M')

      return isType && isLt2M
    },
    async handleUploadAvatar({file}) {
      const loadWrapper = LoadingWrapper({target: this.$refs.dialog_form.$el})
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadUserAvatar(formData)
        if (res.code === 200) {
          this.formDialog.avatarUrl = res.data
          ShowMsg('头像上传成功', 'success')
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        loadWrapper.close()
      }
    },
    // 执行【新增/修改】
    async handleFormSubmit() {
      try {
        const tmp = {...this.formDialog}
        tmp.address = tmp.area || tmp.location ? `${tmp.area?.join(',') ?? ''}#${tmp?.location}`: ''
        const res = this.isInsertOrUpdate? await addUser(tmp): await updateUser(tmp)
        if (res.code === 200) {
          ShowMsg(this.isInsertOrUpdate? '添加成功': '修改成功', 'success');
          this.dialogClose();
          this.getSearch();
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    // 执行【删除】
    async handleRowDel(row) {
      try {
        const res = await deleteUserByID(row.id);
        if (res.code === 200) {
          ShowMsg('删除成功', 'success')
          this.getSearch()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    // 执行【批量删除】
    async handleRowsDel() {
      try {
        const res = await deleteUserBySelect(this.seletionIds);
        if (res.code === 200) {
          ShowMsg('批量删除成功', 'success');
          this.getSearch();
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    // 执行【导入】
    handleImport: throttle(async function ({file}) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await impUser(formData)
        if (res) {
          this.handleNotify('导入成功', '已成功导入数据', 'success');
          this.getSearch()
        } else this.handleNotify('导入失败', res.msg)
      } catch (e) {
        this.handleNotify('导入异常', e.message, 'error')
      }
    }, 500),
    // 执行【导出】
    handleExport: debounce(async function () {
      try {
        const res = await expUser()
        if (res.status === 200) {
          // 切割文件名
          const encodeFileName = res.headers['content-disposition'].split('filename=')[1]
          // 解码
          const fileName = decodeURIComponent(encodeFileName)
          // 设置Type类型
          const blob = new Blob([res.data], {type: res.data.type})
          // 生成文件链接
          const fileURL = window.URL.createObjectURL(blob)
          // 创建超链接
          const link = document.createElement('a');
          link.style.display = 'none'
          link.href = fileURL
          link.setAttribute('download', fileName)
          // 执行下载
          link.click()
          // 移除link
          link.remove()
          this.handleNotify('导出成功', `已成功导出文件：${fileName}`, 'success')
        } else this.handleNotify('导出失败', `失败原因：${res.statusText}`)
      } catch (e) {
        this.handleNotify('导出异常', `异常原因：${e.message}`, 'error')
      }
    }, 3000, {leading: true}),
    // 执行【分页】
    getSearch: throttle(async function () {
      this.isTableLoading = true
      try {
        const param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.formSearch
        }
        param.address = param.address? param.address.join(','): ''

        const res = await getPagination(param)
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isTableLoading = false
      }
    }, 500, {leading: true})
  },
};
</script>

<style lang="less">
.user_container {
  .card_search {
    .user_search {
      .el-form-item__label {
        font-size: 15px;
      }

      .btn {
        display: flex;

        button {
          flex: 1;
        }
      }
    }
  }

  .card_tableData {
    .option {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .func {
        display: flex;
      }
    }
  }

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
</style>