<template>
  <section class="firm_container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card shadow="never" header="搜索企业">
          <el-form :model="searchForm">
            <el-form-item>
              <el-input clearable prefix-icon="" placeholder="请输入企业编号" v-model.number="searchForm.id"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input clearable prefix-icon="" placeholder="请输入企业名称" v-model.trim="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input clearable prefix-icon="" placeholder="请输入企业所在区域，省、市、区" v-model.trim="searchForm.address"></el-input>
            </el-form-item>
            <el-form-item class="fl_r">
              <el-button size="medium" type="primary" icon="el-icon-search" @click="getFirmList">搜索</el-button>
              <el-button size="medium" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never" class="card_firm">
          <div slot="header">
            <span>企业列表</span>

            <el-pagination
              class="fl_r command"
              :total="total"
              :page-size="pageSize"
              :current-page="pageNum"
              :page-sizes="[10, 20, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <el-cascader
              clearable
              collapse-tags
              size="small"
              placeholder="筛选企业类型：不限"
              :props="defaultProps"
              :show-all-levels="false"
              :options="firmCategoryData"
              v-model="selectCategory">
              <template slot-scope="{data}">
                <span>{{ data.name }}</span>
                <span v-if="data.children">({{ data.children.length }})</span>
              </template>
            </el-cascader>
            <div style="display: flex">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加企业</el-button>
              <el-popconfirm title="是否执行批量删除？" cancel-button-text="我再想想" @confirm="handleRowsDel">
                <el-button slot="reference" class="ml_10 mr_10" size="small" type="danger" icon="el-icon-delete" :disabled="selectIds && selectIds.length < 2">批量删除</el-button>
              </el-popconfirm>
              <el-upload action="" accept=".xlsx" :show-file-list="false" :http-request="handleExcelImp">
                <el-button class="mr_10" size="small" type="success" icon="el-icon-download">导入</el-button>
              </el-upload>
              <el-button size="small" type="info" icon="el-icon-upload2" @click="handleExcelExp">导出</el-button>
            </div>
          </div>

          <el-table border stripe class="mt_20" v-loading="isLoading" :data="tableData" @selection-change="handleSelectChange">
            <el-table-column fixed type="selection" width="40" :resizable="false"></el-table-column>
            <el-table-column prop="id" label="编号" width="80" :resizable="false"></el-table-column>
            <el-table-column prop="category" label="类型" width="120">
              <template slot-scope="scope">
                <span>{{ firmCategoryData.flatMap(v => v.children).find(v => v.id === scope.row.category)?.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="address" label="所在区域" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.address?.split('#')[0]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="详细地址" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.address?.split('#')[1]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="logo" label="图标" width="100" :resizable="false">
              <template slot-scope="scope">
                <el-link v-if="scope.row.logo" @click="handleView(true, scope.row.logo)">预览<i class="el-icon-view el-icon--right"></i></el-link>
                <span v-else style="color: #aaa">暂无</span>
              </template>
            </el-table-column>
            <el-table-column prop="profile" label="简介" width="100" :resizable="false">
              <template slot-scope="scope">
                <el-link v-if="scope.row.profile" @click="handleView(false, scope.row.profile)">查看<i class="el-icon-view el-icon--right"></i></el-link>
                <span v-else style="color: #aaa">暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" icon="el-icon-edit" class="mr_10" @click="handleFirmEdit(scope.row)">编辑</el-button>
                <el-popconfirm title="确定要删除吗？" @confirm="handleDelFirm(scope.row.id)">
                  <el-button size="mini" type="danger" icon="el-icon-remove-outline" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog top="5vh" width="840px" :title="imgViewSrc? '图片预览': '企业简介'" :visible.sync="viewVisible" :close-on-click-modal="false" @close="viewClose">
      <el-image v-if="imgViewSrc" style="width: 100%;" :src="imgViewSrc"></el-image>
      <mavon-editor
        v-if="mdViewSrc"
        ishljs
        :editable="false"
        :subfield="false"
        :toolbars-flag="false"
        :default-open="'preview'"
        :value="mdViewSrc" />
    </el-dialog>

    <el-dialog top="5vh" title="企业信息" width="1200px" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <el-form ref="dialogForm" label-position="top" :model="dialogForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="图标">
              <el-upload
                action=""
                :show-file-list="false"
                :before-upload="beforeUploadLogo"
                :http-request="handleUploadLogo">
                <el-avatar
                  class="firm_logo"
                  shape="square"
                  fit="contain"
                  :size="80"
                  :src="dialogForm.logo">
                  <i style="font-size: 60px;" class="el-icon-picture-outline"></i>
                </el-avatar>
              </el-upload>
            </el-form-item>
            <el-form-item label="企业类型">
              <el-cascader
                clearable
                style="width: 100%"
                placeholder="请选择企业类型"
                :show-all-levels="false"
                :props="{label: 'name', value: 'id', emitPath: false}"
                :options="firmCategoryData"
                v-model="dialogForm.category">
                <template slot-scope="{data}">
                  <span>{{ data.name }}</span>
                  <span v-if="data.children">({{ data.children.length }})</span>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input clearable placeholder="请输入企业名称" v-model.trim="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所在区域">
              <el-cascader
                clearable
                filterable
                style="width: 100%;"
                placeholder="请选择省、市、区"
                :options="pcaTextArr"
                v-model="dialogForm.area">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input clearable placeholder="请输入详细地址" v-model.trim="dialogForm.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="企业简介">
              <mavon-editor ref="markdown" style="height: 526px" ishljs v-model="dialogForm.profile" @imgAdd="handleMdUpload" />
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
import MapLoader from '@/components/map_loader'
import {throttle, debounce} from 'lodash'
import {LoadingWrapper, ShowMsg, ShowNotify} from '@/utils/common'
import {addFirm, deleteFirm, deleteFirmList, getPagination, updateFirm} from '@/api/firm'
import { pcaTextArr } from 'element-china-area-data'
import {expFirm, impFirm, markdownFirm, uploadFirmLogo} from '@/api/upload'
import {getFirmTypeTree} from '@/api/category'

export default {
  name: "FirmView",
  // components: { MapLoader },
  data() {
    return {
      defaultProps: {
        multiple: true,
        emitPath: false,
        label: 'name',
        value: 'id'
      },
      searchForm: {
        id: '',
        name: '',
        address: ''
      },
      dialogForm: {},
      tableData: [],
      firmCategoryData: [],
      selectCategory: [],
      selectIds: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      imgViewSrc: '',
      mdViewSrc: '',
      viewVisible: false,
      dialogVisible: false,
      isLoading: false,
      addOrUpdate: true,
      pcaTextArr,
    }
  },
  created() {
    this.categoryTree()
  },
  mounted() {
    this.getFirmList()
  },
  watch: {
    selectCategory() {
      this.getFirmList()
    }
  },
  methods: {
    handleSelectChange(list) {
      this.selectIds = list.map(v => v.id)
    },
    handleView(type, src) {
      type? this.imgViewSrc = src: this.mdViewSrc = src
      this.viewVisible = true
    },
    viewClose() {
      this.viewVisible = false
      this.imgViewSrc = ''
      this.mdViewSrc = ''
    },
    resetSearch() {
      this.searchForm = {}
      this.getFirmList()
    },
    dialogClose() {
      this.dialogForm = {}
      this.dialogVisible = false
      this.addOrUpdate = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getFirmList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getFirmList()
    },
    handleFirmEdit(row) {
      this.dialogVisible = true
      this.addOrUpdate = false

      this.dialogForm = {
        area: row.address? row.address.split('#')[0]?.split(','): [],
        location: row.address? row.address.split('#')[1]: '',
        ...row
      }
    },
    beforeUploadLogo(file) {
      const isType = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = (file.size / 1024 / 1024) < 2;
      if (!isType) ShowMsg('图片类型只能是jpeg/png格式')
      if (!isLt2M) ShowMsg('上传图片大小不能超过2M')

      return isType && isLt2M
    },
    async handleDelFirm(id) {
      try {
        const res = await deleteFirm(id)
        if (res.code === 200) {
          this.$store.dispatch('loadFirms')
          ShowMsg('企业删除成功', 'success')
          this.getFirmList()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleRowsDel() {
      try {
        const res = await deleteFirmList(this.selectIds)
        if (res.code === 200) {
          this.$store.dispatch('loadFirms')
          ShowMsg('批量删除成功', 'success')
          this.getFirmList()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    handleExcelImp: throttle(async function({file}) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await impFirm(formData)
        if (res) {
          ShowNotify({title: '导入成功', type: 'success', message: '企业信息导入成功'})
          this.getFirmList()
        } else ShowNotify({title: '导入失败', message: res.msg})
      } catch (e) {
        ShowNotify({title: '导入异常', type: 'error', message: e.message})
      }
    }, 500),
    handleExcelExp: debounce(async function() {
      try {
        const res = await expFirm()
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
          ShowNotify({title: '导出成功', type: 'success', message: `已成功导出文件：${fileName}`})
        } else ShowNotify({title: '导出失败', message: res.statusText})
      } catch (e) {
        ShowNotify({title: '导出异常', type: 'error', message: e.message})
      }
    }, 3000, {leading: true}),
    async handleUploadLogo({file}) {
      const wrap = LoadingWrapper({target: this.$refs.dialogForm.$el})
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadFirmLogo(formData)
        if (res.code === 200) {
          this.dialogForm.logo = res.data
          this.$forceUpdate()
          ShowMsg('图片上传成功', 'success')
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        wrap.close()
      }
    },
    async handleMdUpload(pos, file) {
      try {
        const $vm = this.$refs.markdown
        const formData = new FormData()
        formData.append('file', file)

        const res = await markdownFirm(formData)
        if (res.code === 200) {
          ShowMsg('图片上传成功', 'success')
          $vm.$img2Url(pos, res.data)
          this.$forceUpdate()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleFormSubmit() {
      const wrap = LoadingWrapper({target: this.$refs.dialogForm.$el})
      try {
        const data = {...this.dialogForm}
        data.address = data.area || data.location ? `${data.area?.join(',') ?? ''}#${data.location ?? ''}`: ''
        const res = this.addOrUpdate? await addFirm(data): await updateFirm(data)
        if (res.code === 200) {
          this.$store.dispatch('loadFirms')
          ShowMsg(this.addOrUpdate? '添加成功': '信息更新成功', 'success')
          this.dialogClose()
          this.getFirmList()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        wrap.close()
      }
    },
    categoryTree: throttle(async function() {
      try {
        const res = await getFirmTypeTree()
        if (res.code === 200) {
          this.firmCategoryData = res.data
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    }, 300, {leading: true}),
    getFirmList: throttle(async function() {
      this.isLoading = true
      try {
        const res = await getPagination({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.searchForm
        }, this.selectCategory)
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isLoading = false
      }
    }, 500, {leading: true}),
  }
}
</script>

<style lang="less">
.firm_container {
  .title {
    display: flex;

    .el-select {
      width: 120px;
    }
  }

  .card_firm {
    .el-card__header {
      height: 58px;
    }

    .card_header {
      display: flex;
      justify-content: space-between;
    }
  }

  .firm_logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>