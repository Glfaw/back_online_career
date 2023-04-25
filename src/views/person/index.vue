<template>
  <section class="person_container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" class="person_info">
          <div slot="header">
            <span>个人信息</span>
            <div v-if="!isFormEdit" class="fl_r command">
              <el-button
                size="small"
                type="success"
                icon="el-icon-edit"
                @click="isFormEdit = true"
              >编辑</el-button>
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
                  class="u_avatar fl_r"
                  :show-file-list="false"
                  :before-upload="beforeUploadAvatar"
                  :http-request="handleUploadAvatar"
                >
                  <el-avatar
                    shape="square"
                    :size="100"
                    :src="person.avatarUrl"
                  ></el-avatar>
                </el-upload>
              </el-col>
            </el-row>
            
            <el-form-item label="用户名" >
              <el-input prefix-icon="el-icon-user" v-model="person.name"></el-input>
            </el-form-item>
            <el-form-item label="所属角色">
              <el-select v-model="person.roleId" @change="handleRoleChange">
                <el-option label="超级管理员" :value="1"></el-option>
                <el-option label="管理员" :value="2"></el-option>
                <el-option label="求职者" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属企业">
              <el-select filterable default-first-option clearable placeholder="暂无选择" v-model="person.firmId" :disabled="person.roleId != 2">
                <el-option
                  v-for="item in allFirms"
                  :key="item.id"
                  :label="`${item.id}, ${item.type}, ${item.designation}`"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0px" v-if="isFormEdit">
              <div class="fl_r">
                <el-button type="warning" @click="handleUpdatePerson">保存</el-button>
                <el-button @click="handleGetPerson">取消</el-button>
              </div>
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
              <el-input prefix-icon="el-icon-location" v-model="person.address" :placeholder="person.address? '有': '暂无填写'"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { uploadAvatar } from '@/api/upload'
import { LoadingWrapper, ShowMsg } from "@/utils/common"
import { loadPersonal, refreshPersonal } from "@/api/purview"

export default {
  name: 'PersonView',
  data() {
    return {
      isFormEdit: false,
      person: {}
    }
  },
  mounted() {
    if(this.user?.id)
    {
      this.handleGetPerson()
    }
    else ShowMsg('请先登录', 'error')
  },
  computed: {
    ...mapState(['allFirms', 'user']),
  },
  methods: {
    handleRoleChange(role) {
      if(role !== 2) this.person.firmId = null
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

        const res = await uploadAvatar(formData)
        if(res.code === 200) {
          ShowMsg('图片上传成功，请点击保存完成修改')
          this.person.avatarUrl = res.data
        } else ShowMsg(res.msg)
      } catch (error) {
        ShowMsg(error.message, 'error')
      } finally {
        loadWrapper.close()
      }
    },
    async handleGetPerson() {
      this.isFormEdit = false;

      const loadWrapper = LoadingWrapper({ target: this.$el.parentElement, text: '加载中...' })
      try {
        const res = await loadPersonal(this.user.id);
        if(res.code === 200) this.person = res.data
        else ShowMsg(res.msg)
      } catch (error) {
        ShowMsg(error.message, 'error')
      } finally {
        loadWrapper.close()
      }
    },
    async handleUpdatePerson() {
      try {
        const res = await refreshPersonal(this.person)
        if(res.code === 200) {
          this.isFormEdit = false
          this.$emit('refreshUser', this.person.id)
        }
        else ShowMsg(res.msg)
      } catch (error) {
        ShowMsg(error.message, 'error')
      }
    },
  }
}
</script>

<style lang="less">
.person_container {

  .person_info {
    .info_header {
      .el-form-item {
        margin-bottom: unset;
      }
    }
  }  
}
</style>