<template>
  <section class="resume_container">
    <el-card shadow="never" class="mb_10">
      <el-date-picker
        size="medium"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-model="selectDate"
      ></el-date-picker>
      <el-button size="medium" icon="el-icon-search" type="primary">搜索</el-button>
      <el-button size="medium" icon="el-icon-refresh">重置</el-button>

      <el-pagination
        class="fl_r"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <el-card shadow="never">
      <el-table stripe class="mb_10" :data="tableData">
        <el-table-column prop="userInfo" label="用户" :resizable="false" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link @click="handleDialog(scope.row.userInfo, false)">{{scope.row.userInfo.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="careerInfo" label="数据来源" :resizable="false" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link @click="handleDialog(scope.row.careerInfo.detail, true)">{{scope.row.careerInfo.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="resumeInfo" label="用户简历" :resizable="false">
          <template slot-scope="scope">
            <el-link v-if="scope.row.resumeInfo.file" :href="scope.row.resumeInfo.file" type="primary">下载</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="resumeInfo" label="用户简介" :resizable="false">
          <template slot-scope="scope">
            <el-link v-if="scope.row.resumeInfo.detail" @click="handleDialog(scope.row.resumeInfo.detail, true)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" :resizable="false" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="100" label="操作" :resizable="false">
          <template slot-scope="scope">
            <el-popconfirm title="确定要删除吗？" @confirm="handleDelSingle(scope.row.careerInfo.id, scope.row.resumeInfo.id)">
              <el-button slot="reference" size="mini" type="danger" icon="el-icon-remove-outline">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog top="5vh" :visible="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <el-descriptions border title="用户信息" v-show="Object.keys(dialog.userInfo).length > 0" :column="2">
        <el-descriptions-item label="头像">
          <el-avatar shape="square" :src="dialog.userInfo.avatarUrl"></el-avatar>
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{dialog.userInfo.name}}</el-descriptions-item>
        <el-descriptions-item label="性别">{{dialog.userInfo.gender | male}}</el-descriptions-item>
        <el-descriptions-item label="学历">{{dialog.userInfo.degree | degree}}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{dialog.userInfo.age}}岁</el-descriptions-item>
        <el-descriptions-item label="个性签名">{{dialog.userInfo.signature}}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{dialog.userInfo.phone}}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{dialog.userInfo.email}}</el-descriptions-item>
        <el-descriptions-item label="居住地址">{{dialog.userInfo.address | address}}</el-descriptions-item>
      </el-descriptions>

      <mavon-editor
        v-show="dialog.markdown"
        style="transform: translateY(-20px);"
        ishljs
        :editable="false"
        :subfield="false"
        :box-shadow="false"
        :toolbars-flag="false"
        :default-open="'preview'"
        v-model="dialog.markdown" />
    </el-dialog>
  </section>
</template>

<script>
import {throttle} from 'lodash'
import {ShowMsg} from '@/utils/common'
import {delCollResume, getCollResumeList} from '@/api/resume'
import {mapState} from 'vuex'

export default {
  name: "ResumeView",
  data() {
    return {
      careerDetail: {},
      selectDate: [],
      tableData: [],
      dialogVisible: false,
      isLoading: false,
      dialog: {
        userInfo: {},
        markdown: ''
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
    }
  },
  created() {
    this.handleLoadTable()
  },
  filters: {
    male(val) {
      return val? '男': '女'
    },
    degree(val) {
      let name = ''
      switch (val) {
        case 0: name = '专科及以下'; break;
        case 1: name = '本科'; break;
        case 2: name = '硕士'; break;
        case 3: name = '博士及以上'; break;
      }
      return name
    },
    address(val) {
      return val? `${val.split('#')[0]} ${val.split('#')[1]}`: ''
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    dialogClose() {
      this.dialogVisible = false
      this.dialog = {
        userInfo: {},
        markdown: ''
      }
    },
    handleDialog(value, type) {
      type? this.dialog.markdown = value: this.dialog.userInfo = {...value}
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleLoadTable()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleLoadTable()
    },
    async handleDelSingle(career, resume) {
      const data = {
        uid: this.user.id,
        career, resume
      }
      try {
        const res = await delCollResume(data)
        if (res.code === 200) {
          ShowMsg('删除成功', 'success')
          this.handleLoadTable()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    },
    handleLoadTable: throttle(async function() {
      this.isLoading = true
      try {
        const res = await getCollResumeList({
          uid: this.user.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          date: this.selectDate
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

<style lang="less">
.resume_container {
  .func {
    display: flex;
    justify-content: space-between;
  }
}
</style>