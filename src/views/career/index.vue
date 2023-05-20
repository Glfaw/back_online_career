<template>
  <section class="career_container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card shadow="never" header="搜索信息">
          <el-form :model="infoSearch">
            <el-form-item>
              <el-input clearable placeholder="信息编号" v-model.number="infoSearch.id"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input clearable placeholder="信息标题" v-model.trim="infoSearch.title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                unlink-panels
                type="daterange"
                style="width: 100%;"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                v-model="infoSearch.date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="fl_r">
              <el-button size="medium" type="primary" icon="el-icon-search" @click="handleLoadTable">搜索</el-button>
              <el-button size="medium" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never">
          <div slot="header">
            <span>职位列表</span>
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
            <el-cascader
              clearable
              collapse-tags
              size="small"
              placeholder="筛选职位类型：不限"
              :props="defaultProps"
              :show-all-levels="false"
              :options="categoryTree"
              v-model="selectTypes">
              <template slot-scope="{data}">
                <span>{{ data.name }}</span>
                <span v-if="data.children">({{ data.children.length }})</span>
              </template>
            </el-cascader>
            <div class="func">
              <el-button class="mr_10" size="small" type="primary" icon="el-icon-plus" @click="dialogVisible = true">发布招聘</el-button>
              <el-popconfirm title="是否执行批量删除？" cancel-button-text="我再想想" @confirm="handleDelList">
                <el-button slot="reference" size="small" type="danger" icon="el-icon-delete" :disabled="selectIds && selectIds.length < 2">批量删除</el-button>
              </el-popconfirm>
            </div>
          </div>

          <el-table border stripe v-loading="isLoading" :data="tableData">
            <el-table-column type="selection" width="40" :resizable="false"></el-table-column>
            <el-table-column prop="id" width="100" label="编号" :resizable="false"></el-table-column>
            <el-table-column prop="category" label="类型" :resizable="false">
              <template slot-scope="scope">
                <span>{{ categoryTree.flatMap(v => v.children).find(v => v.id === scope.row.category)?.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="名称" :resizable="false" show-overflow-tooltip></el-table-column>
            <el-table-column prop="base" label="底薪" :resizable="false"></el-table-column>
            <el-table-column prop="salary" label="封顶" :resizable="false"></el-table-column>
            <el-table-column prop="address" label="工作地址" :resizable="false" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.address?.split('#')[0]}} {{scope.row.address?.split('#')[1]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" label="职位详情" :resizable="false">
              <template slot-scope="scope">
                <el-link v-if="scope.row.detail" @click="viewOpen(scope.row.detail)">查看<i class="el-icon-view el-icon--right"></i></el-link>
                <span v-else style="color: #aaa">暂无</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" :resizable="false" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="200" label="操作" :resizable="false">
              <template slot-scope="scope">
                <el-button class="mr_10" size="mini" type="warning" icon="el-icon-edit" @click="handleFormEdit(scope.row)">编辑</el-button>
                <el-popconfirm title="确定要删除吗？" @confirm="handleDel(scope.row.id)">
                  <el-button slot="reference" size="mini" type="danger" icon="el-icon-remove-outline">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog top="5vh" title="职位详情" :visible.sync="viewVisible" :close-on-click-modal="false" @close="viewClose">
      <mavon-editor
        ishljs
        :editable="false"
        :subfield="false"
        :toolbars-flag="false"
        :default-open="'preview'"
        :value="viewMd" />
    </el-dialog>

    <el-dialog top="5vh" title="招聘信息" width="1200px" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <el-form label-position="top" :model="dialogForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="职位类型">
              <el-cascader
                clearable
                style="width: 100%;"
                placeholder="请选择职位类型"
                :props="{label: 'name', value: 'id', emitPath: false}"
                :options="categoryTree"
                v-model="dialogForm.category"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="职位名称">
              <el-input clearable placeholder="请输入职位名称" v-model="dialogForm.title"></el-input>
            </el-form-item>
            <el-form-item label="薪水">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-input clearable placeholder="请输入职位薪水底薪" v-model.number="dialogForm.base"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input clearable placeholder="请输入职位薪水封顶" v-model.number="dialogForm.salary"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="所在区域">
              <el-cascader
                clearable
                filterable
                style="width: 100%;"
                placeholder="请选择工作所在区域"
                :options="pcaTextArr"
                v-model="dialogForm.area"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input clearable placeholder="请输入工作详细地址" v-model="dialogForm.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="职位详情">
              <mavon-editor ishljs ref="markdown" style="height: 485px" v-model="dialogForm.detail" @imgAdd="handleMdUpload" />
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
import {pcaTextArr} from 'element-china-area-data'
import {mapState} from 'vuex'
import {throttle} from 'lodash'
import {ShowMsg} from '@/utils/common'
import {getCareerTypeTree} from '@/api/category'
import {addCareer, delCareerById, delCareerList, getCareerList, updateCareer} from '@/api/career'
import {markdownCareer} from '@/api/upload'

export default {
  name: "CareerView",
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      defaultProps: {
        multiple: true,
        emitPath: false,
        label: 'name',
        value: 'id'
      },
      infoSearch: {},
      dialogForm: {},
      tableData: [],
      categoryTree: [],
      selectIds: [],
      selectTypes: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      viewMd: '',
      isLoading: false,
      dialogVisible: false,
      viewVisible: false,
      addOrUpdate: true,
      pcaTextArr
    }
  },
  created() {
    if (this.user.id) {
      this.getTypeTree()
      this.handleLoadTable()
    }
  },
  watch: {
    selectTypes() {
      this.handleLoadTable()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    viewOpen(val) {
      this.viewVisible = true
      this.viewMd = val
    },
    viewClose() {
      this.viewVisible = false
      this.viewMd = ''
    },
    resetSearch() {
      this.infoSearch = {}
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
      this.dialogForm = {
        area: row.address? row.address.split('#')[0]?.split(','): [],
        location: row.address? row.address.split('#')[1]: '',
        ...row
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
    async handleMdUpload(pos, file) {
      try {
        const $vm = this.$refs.markdown
        const formData = new FormData()
        formData.append('file', file)

        const res = await markdownCareer(formData)
        if (res.code === 200) {
          ShowMsg('图片上传成功', 'success')
          $vm.$img2Url(pos, res.data)
          this.$forceUpdate()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleDel(id) {
      try {
        const res = await delCareerById(id)
        if (res.code === 200) {
          ShowMsg('删除成功', 'success')
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleDelList() {
      try {
        const res = await delCareerList(this.selectIds)
        if (res.code === 200) {
          ShowMsg('批量删除成功', 'success')
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    async handleFormSubmit() {
      try {
        const data = {...this.dialogForm}
        data.address = data.area || data.location ? `${data.area?.join(',') ?? ''}#${data.location ?? ''}`: ''
        const form = {
          uid: this.user.id,
          ...data
        }
        const res = this.addOrUpdate? await addCareer(form): await updateCareer(form)
        if (res.code === 200) {
          ShowMsg(this.addOrUpdate? '添加成功': '修改成功', 'success')
          this.dialogClose()
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    handleLoadTable: throttle(async function() {
      this.isLoading = true
      try {
        const res = await getCareerList({
          uid: this.user.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.infoSearch
        }, this.selectTypes)
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        this.isLoading = false;
      }
    }, 300, {leading: true})
  }
}
</script>

<style lang="less">
.career_container {
  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .func {
      display: flex;
    }
  }
}
</style>