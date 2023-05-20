<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card shadow="never" header="更改密码">
        <el-form status-icon ref="ruleForm" label-width="80px" :rules="ruleForm" :model="pwd">
          <el-form-item required label="旧密码" prop="old">
            <el-input clearable show-password type="password" placeholder="请输入旧密码" v-model.trim="pwd.old"></el-input>
          </el-form-item>
          <el-form-item required label="新密码" prop="now">
            <el-input clearable show-password type="password" placeholder="请输入新密码" v-model.trim="pwd.now"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input clearable show-password type="password" placeholder="再次确认密码" v-model.trim="pwd.confirm"></el-input>
          </el-form-item>
          <el-form-item class="fl_r">
            <el-button size="medium" icon="el-icon-refresh" type="info" @click="resetForm">重置</el-button>
            <el-button size="medium" icon="el-icon-position" type="primary" @click="handleValid">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {throttle} from 'lodash'
import {updatePwd} from '@/api/user'
import {LoadingWrapper, ShowMsg} from '@/utils/common'
import {mapState} from 'vuex'

export default {
  name: "Pwd",
  data() {
    const validateNow = (rule, val, cb) => {
      if (val === '') {
        cb(new Error('请输入新密码'));
      } else {
        if (this.pwd.confirm !== '') {
          this.$refs.ruleForm.validateField('confirm');
        }
        cb();
      }
    }
    const validateConfirm = (rule, val, cb) => {
      if (val === '') {
        cb(new Error('请再次输入密码'));
      } else if (val !== this.pwd.now) {
        cb(new Error('两次输入密码不一致!'));
      } else {
        cb();
      }
    }
    return {
      pwd: {
        old: '',
        now: '',
        confirm: ''
      },
      ruleForm: {
        old: [
          {required: true, message: '请输入旧密码', trigger: 'blur'}
        ],
        now: [
          {validator: validateNow, trigger: 'blur'}
        ],
        confirm: [
          {validator: validateConfirm, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleValid() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.handleSubmit()
        } else return false
      })
    },
    handleSubmit: throttle(async function() {
      const wrapper = LoadingWrapper({target: this.$refs.ruleForm.$el})
      try {
        const res = await updatePwd({
          uid: this.user.id,
          account: this.user.account,
          old: this.pwd.old,
          now: this.pwd.now
        })
        if (res.code === 200) {
          ShowMsg('修改密码成功', 'success')
          this.resetForm()
        } else ShowMsg(res.msg)
      } catch (e) {
        ShowMsg(e.message, 'error')
      } finally {
        wrapper.close()
      }
    }, 300, {leading: true})
  }
}
</script>