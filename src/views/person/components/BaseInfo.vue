<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="never" class="person_info">
        <div slot="header">
          <span>个人信息</span>
          <div v-if="!isFormEdit" class="fl_r command">
            <el-button
              size="small"
              type="warning"
              icon="el-icon-edit"
              @click="isFormEdit = true">编辑</el-button>
          </div>
        </div>
        <el-form label-width="80px" label-position="left" :model="person" :disabled="!isFormEdit">
          <el-row class="mb_5 info_header" :gutter="20">
            <el-col :span="14" style="transform: translateY(-12px)">
              <el-form-item label="编号" label-width="40px">
                <span>{{person.id}}</span>
              </el-form-item>
              <el-form-item label="账号" label-width="40px">
                <span>{{person.account}}</span>
              </el-form-item>
              <el-form-item label="性别" label-width="40px">
                <div v-if="isFormEdit">
                  <el-radio :label="1" v-model="person.gender">男</el-radio>
                  <el-radio :label="0" v-model="person.gender">女</el-radio>
                </div>
                <span v-else>{{person.gender? '男': '女'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="fl_r">
              <el-upload
                action=""
                accept=".jpg, .jpeg, .png"
                class="u_avatar fl_r"
                :show-file-list="false"
                :before-upload="beforeUploadAvatar"
                :http-request="handleUploadAvatar">
                <el-avatar
                  shape="square"
                  :size="100"
                  :src="person.avatarUrl"
                ></el-avatar>
              </el-upload>
            </el-col>
          </el-row>

          <el-form-item label="用户名" >
            <el-input clearable prefix-icon="el-icon-user" v-model="person.name"></el-input>
          </el-form-item>
          <el-form-item label="教育程度">
            <el-select clearable v-model="person.degree">
              <el-option label="专科及以下" :value="0"></el-option>
              <el-option label="本科" :value="1"></el-option>
              <el-option label="硕士" :value="2"></el-option>
              <el-option label="博士及以上" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="fl_r" v-if="isFormEdit">
            <el-button size="medium" type="info" @click="handleCancel">取消</el-button>
            <el-button size="medium" type="primary" @click="handleSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never" header="基本信息" class="person_info_base">
        <el-form label-width="70px" label-position="left" :model="person" :disabled="!isFormEdit">
          <el-form-item label="个性签名">
            <el-input v-model="person.signature"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户年龄">
                <el-input prefix-icon="el-icon-date" v-model="person.age"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户电话">
                <el-input prefix-icon="el-icon-phone" v-model="person.phone" :placeholder="person.phone? '有': '无'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="邮箱地址">
            <el-input prefix-icon="el-icon-message" v-model="person.email" :placeholder="person.email? '有': '无'"></el-input>
          </el-form-item>
          <el-form-item label="居住地址">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="12">
                <el-cascader
                  clearable
                  filterable
                  style="width: 100%;"
                  placeholder="请输入省、市、区"
                  :options="pcaTextArr"
                  v-model="person.area"
                ></el-cascader>
              </el-col>
              <el-divider direction="vertical"></el-divider>
              <el-col :span="12">
                <el-input prefix-icon="el-icon-location" v-model="person.location" placeholder="填写具体详细地址"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {debounce} from 'lodash'
import {pcaTextArr} from 'element-china-area-data'
import {LoadingWrapper, ShowMsg} from '@/utils/common'
import {uploadUserAvatar} from '@/api/upload'
import {mapState} from 'vuex'

export default {
  name: "BaseInfo",
  data() {
    return {
      isFormEdit: false,
      person: {},
      pcaTextArr
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.$bus.$on('refreshUserStatus', v => this.isFormEdit = !v)
    if(this.user)
    {
      this.format()
    }
    else ShowMsg('请先登录', 'error')
  },
  beforeDestroy() {
    this.$bus.$off(['refreshUserStatus'])
  },
  methods: {
    format() {
      let address = this.user.address
      this.person = {
        area: address? address.split('#')[0]?.split(','): [],
        location: address? address.split('#')[1]: '',
        ...this.user
      }
    },
    handleCancel() {
      this.format()
      this.isFormEdit = false
    },
    beforeUploadAvatar(file) {
      const isType = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = (file.size / 1024 / 1024) < 2;
      if(!isType) ShowMsg('图片类型只能是jpeg/png格式')
      if(!isLt2M) ShowMsg('上传图片大小不能超过2M')

      return isType && isLt2M
    },
    async handleUploadAvatar({file}) {
      const loadWrapper = LoadingWrapper({ target: this.$el.parentElement, text: '图片上传中...' })
      try {
        const formData = new FormData();
        formData.append('file', file)

        const res = await uploadUserAvatar(formData)
        if(res.code === 200) {
          ShowMsg('图片上传成功，请点击保存完成修改')
          this.person.avatarUrl = res.data
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        loadWrapper.close()
      }
    },
    handleSubmit: debounce(function () {
      const data = {...this.person}
      data.address = data.area || data.location ? `${data.area?.join(',') ?? ''}#${data.location ?? ''}`: ''
      this.$bus.$emit('refreshUser', data)
    }, 200, {trailing: true}),
  }
}
</script>

<style lang="less">
.person_info {
  .info_header {
    .el-form-item {
      margin-bottom: unset;
    }
  }
}
</style>