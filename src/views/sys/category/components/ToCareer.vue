<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card shadow="never" header="搜索类型">
        <el-form :model="careerSearch">
          <el-form-item>
            <el-input clearable prefix-icon="" placeholder="请输入类型编号" v-model="careerSearch.id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input clearable prefix-icon="" placeholder="请输入类型名称" v-model="careerSearch.name"></el-input>
          </el-form-item>
          <el-form-item class="fl_r">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleLoadTable">搜索</el-button>
            <el-button size="medium" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="18">
      <el-card shadow="never">
        <div slot="header">
          <span>查询结果</span>
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
          <el-button class="mr_10" size="small" type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加类型</el-button>
          <el-popconfirm title="是否执行批量删除？" cancel-button-text="我再想想" @confirm="handleDelTypeList">
            <el-button slot="reference" size="small" type="danger" icon="el-icon-delete" :disabled="selectIds && selectIds.length < 2">批量删除</el-button>
          </el-popconfirm>
        </div>

        <el-table
          border
          stripe
          ref="table"
          row-key="id"
          v-loading="isLoading"
          :data="tableData"
          :select-on-indeterminate="false"
          :tree-props="{children: 'children'}"
          @select="selectRow"
          @select-all="selectAllRow"
          @selection-change="handleSelectChange">
          <el-table-column type="selection" width="40" :resizable="false"></el-table-column>
          <el-table-column prop="id" label="编号" width="100" :resizable="false"></el-table-column>
          <el-table-column prop="name" label="类型名称" :resizable="false"></el-table-column>
          <el-table-column prop="hot" label="是否热门" :resizable="false">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.hot" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="ordered" label="排序" width="100" :resizable="false"></el-table-column>
          <el-table-column align="center" label="操作" width="300" :resizable="false">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" icon="el-icon-edit" class="mr_10" @click="handleFormEdit(scope.row)">编辑</el-button>
              <el-popconfirm title="确定要删除吗？" @confirm="handleDelType(scope.row.id)">
                <el-button slot="reference" size="mini" type="danger" icon="el-icon-remove-outline">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <el-dialog width="500px" title="职位类型信息" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <el-form ref="dialogForm" label-width="80px" label-position="left" :model="dialogForm">
        <el-form-item label="类型编号" v-if="!addOrUpdate">
          <el-input disabled v-model="dialogForm.id"></el-input>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input clearable placeholder="请输入类型名称" v-model.trim="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级类型">
          <el-select clearable filterable placeholder="设置父级类型" v-model="dialogForm.pid === 0? '根类型不能设置': dialogForm.pid" :disabled="categoryTree.map(v => v.id).includes(dialogForm.id)">
            <el-option v-for="item in categoryTree" :key="item.id" :label="`${item.name}（ID: ${item.id}）`" :value="item.id">
              <span class="fl_l">{{item.name}}</span>
              <span class="fl_r">{{`ID: ${item.id}`}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否热门">
          <el-switch
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            v-model="dialogForm.hot">
          </el-switch>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input clearable placeholder="请设置排序权重值" v-model.number="dialogForm.ordered"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" type="info" @click="dialogClose">取消</el-button>
        <el-button size="medium" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {throttle} from 'lodash'
import {ShowMsg} from '@/utils/common'
import {
  addCareerType,
  delCareerTypeById,
  delCareerTypeList,
  getCareerType,
  getCareerTypeTree,
  updateCareerType
} from '@/api/category'

export default {
  name: "ToCareer",
  data() {
    return {
      careerSearch: {},
      dialogForm: {},
      tableData: [],
      categoryTree: [],
      selectIds: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      isLoading: false,
      dialogVisible: false,
      addOrUpdate: true
    }
  },
  created() {
    this.getTypeTree()
    this.handleLoadTable()
  },
  methods: {
    toggleSelect(row, status) {
      row && this.$nextTick(() => this.$refs.table.toggleRowSelection(row, status))
    },
    setChildSelect(children, type) {
      children.forEach(item => this.toggleSelect(item, type))
    },
    selectRow(selection, row) {
      const status = selection.includes(row)
      row?.children && this.setChildSelect(row.children, status)
    },
    selectAllRow(selection) {
      const tbIds = this.tableData.map(v => v.id)
      const ids = selection.map(v => v.id)

      const isSelect = selection.some(item => tbIds.includes(item.id))
      const isCancel = !tbIds.every(id => ids.includes(id))

      if (isSelect) {
        selection.forEach(item => item?.children && this.setChildSelect(item.children, true))
      }
      if (isCancel) {
        this.tableData.forEach(item => item?.children && this.setChildSelect(item.children, false))
      }
    },
    resetSearch() {
      this.careerSearch = {}
      this.handleLoadTable()
    },
    dialogClose() {
      this.dialogForm = {}
      this.dialogVisible = false
      this.addOrUpdate = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleLoadTable()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleLoadTable()
    },
    handleSelectChange(list) {
      this.selectIds = list.map(v => v.id)
    },
    handleFormEdit(row) {
      this.addOrUpdate = false
      this.dialogVisible = true
      this.dialogForm = {...row}
    },
    async handleDelType(id) {
      try {
        const res = await delCareerTypeById(id)
        if (res.code === 200) {
          ShowMsg('类型删除成功', 'success')
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleDelTypeList() {
      try {
        const res = await delCareerTypeList(this.selectIds)
        if (res.code === 200) {
          ShowMsg('批量删除成功', 'success')
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async getTypeTree() {
      try {
        const res = await getCareerTypeTree()
        if (res.code === 200) {
          this.categoryTree = res.data
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleSubmit() {
      try {
        const res = this.addOrUpdate ? await addCareerType(this.dialogForm) : await updateCareerType(this.dialogForm)
        if (res.code === 200) {
          ShowMsg(this.addOrUpdate ? '添加成功' : '修改成功', 'success')
          this.dialogClose()
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.getTypeTree()
      }
    },
    handleLoadTable: throttle(async function() {
      this.isLoading = true
      try {
        const res = await getCareerType({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.careerSearch
        })
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isLoading = false
      }
    }, 300, {leading: true})
  }
}
</script>

<style scoped>

</style>