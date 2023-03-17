<template>
  <div class="login_container">
    <div class="wrapper">
      <div class="login_form">
        <div class="header">
          <h2 class="section">{{ isRegister ? "注册" : "登录" }}</h2>
          <span class="pull">
            <span class="tip">{{ isRegister ? "已有账号?" : "没有账号?" }}</span>
            <el-link
              type="primary"
              :underline="false"
              @click="toSign">{{ isRegister ? "点此登录" : "点此注册" }}</el-link>
          </span>
        </div>
        <el-form class="data" status-icon :rules="rules" :model="form" ref="ruleForm">
          <!-- 注册 -->
          <el-form-item v-if="isRegister" prop="username" label="用户名">
            <el-input
              clearable
              maxlength="12"
              v-model.trim="form.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <!-- 登录 -->
          <el-form-item v-else prop="account" label="账号">
            <el-input
              clearable
              maxlength="12"
              v-model.number="form.account"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              type="password"
              clearable
              show-password
              autocomplete="off"
              v-model.trim="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button v-if="isRegister" type="warning" icon="el-icon-user" @click="userSignInOrUp('ruleForm')">立即注册</el-button>
            <el-button v-else type="primary" icon="el-icon-s-promotion" @click="userSignInOrUp('ruleForm')">用户登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/user";

export default {
  name: "Login",
  data() {
    return {
      form: {
        account: null,
        username: "",
        password: "",
      },
      rules: {
        account: [
          { required: true, message: '输入账号不能为空' },
          { type: 'number', message: '请输入正确格式' }
        ],
        username: [
          { required: true, message: '用户名不能为空' },
        ],
        password: [
          { required: true, message: '输入密码不能为空' },
        ],
      },
      isRegister: false,
    };
  },
  methods: {
    toSign() {
      this.isRegister = !this.isRegister;
      this.form = {}
      this.$refs['ruleForm'].resetFields();
    },
    // 登录或注册
    userSignInOrUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登录
          if(!this.isRegister) {
            this.uLogin()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async uLogin() {
      const user = {
        account: String(this.form.account),
        password: this.form.password
      }

      let msg = this.$message({
        showClose: true
      })

      console.log(user);

      try {
        const { data } = await login(user);

        console.log(data);

        if(data.code == 300) {
          msg.type = 'error'
          msg.message = data.msg
        } else {
          this.$store.commit('setUser', data.data)
          msg.type = 'success'
          msg.message = '登录成功'

          this.$router.replace('/')
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
</script>

<style lang="less">
.login_container {
  .wrapper {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to bottom right, #fc4668, #3f5ef8);
  }

  .login_form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    width: 400px;
    height: 450px;
    background-color: #fff;
    box-shadow: 0 8px 8px rgba(10, 16, 20, 0.24), 0 0 8px rgba(10, 16, 20, 0.12);
    border-radius: 10px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;

      .section {
        font-weight: 400;
        letter-spacing: 5px;
      }

      .pull {
        display: flex;
        align-items: flex-end;
        font-size: 14px;

        .tip {
          margin-right: 10px;
        }
      }
    }

    .data {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    }

    .login_btn {
      margin: 10px 0 20px;

      button {
        width: 100%;
      }
    }

    .el-form-item {
      width: 300px;

      .el-form-item__label {
        font-size: 18px;

        &::before {
          display: none;
        }
      }
    }
  }
}
</style>