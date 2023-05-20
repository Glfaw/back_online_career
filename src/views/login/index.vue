<template>
  <section class="login_container">
    <div class="wrapper">
      <div class="mark"></div>
      <div class="rotation">
        <el-carousel indicator-position="none" arrow="never" height="90vh">
          <el-carousel-item v-for="index in 4" :key="index">
            <el-image :src="`https://web-online-career.oss-cn-hangzhou.aliyuncs.com/rotation/bg${index}.png`"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- S 登录表单 -->
      <div class="login_form">
        <div class="section">
          <img class="logo" src="~@/assets/login/lg.png" alt="" style="border-radius: 10px" />
          <h2 class="header">后台管理</h2>
        </div>
        <el-form class="data" :rules="rules" :model="user" ref="ruleUserForm">
          <!-- 登录 -->
          <el-form-item prop="account" label="账号">
            <el-input
              clearable
              autofocus
              maxlength="12"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model.number="user.account"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              clearable
              show-password
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model.trim="user.password"
              @keyup.enter.native="formValidate"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              @click="formValidate"
              >登录</el-button>
          </el-form-item>
        </el-form>
        <!-- S 表单背景 -->
        <div class="form_bg">
          <img class="ball" src="~@/assets/login/img1.png" alt="" />
          <img class="per" src="~@/assets/login/img2.png" alt="" />
        </div>
        <!-- E 表单背景 -->
      </div>
      <!-- E 登录表单 -->
    </div>
  </section>
</template>

<script>
import {throttle} from 'lodash'
import {login} from "@/api/purview"
import {ShowMsg, ShowNotify} from "@/utils/common"
import {setRoutes} from '@/router'

export default {
  name: "Login",
  data() {
    return {
      user: {
        account: null,
        password: '',
      },
      rules: {
        account: [
          { required: true, message: "输入账号不能为空" },
          { type: "number", message: "请输入正确格式" },
        ],
        password: [{ required: true, message: "输入密码不能为空" }],
      },
    };
  },
  methods: {
    // 表单校验
    formValidate() {
      this.$refs['ruleUserForm'].validate((valid) => {
        if (valid) this.handleLogin();
        else return false;
      });
    },
    // 为用户登录做节流
    handleLogin: throttle(async function() {
      const user = {
        account: this.user.account.toString(),
        password: this.user.password
      }
      try {
        const {code, data, msg} = await login(user);
        if (code === 300) {
          ShowMsg(msg, "error")
        } else {
          this.$store.commit("SET_USER", data)
          this.$store.dispatch('loadMenus', data)
          ShowNotify({
            type: 'success',
            title: '登录成功',
            position: 'bottom-right',
            message: '欢迎使用本系统~'
          })
          setRoutes()
          this.$router.push("/").catch(() => true)
        }
      } catch (error) {
        ShowMsg(error.message, "error")
      }
    }, 200),
  },
};
</script>

<style lang="less">
.login_container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #abc6f8;
  background-image: radial-gradient(closest-side, rgb(255, 255, 255), rgba(235, 105, 78, 0)), radial-gradient(closest-side, rgb(250, 203, 203), rgba(243, 11, 164, 0)), radial-gradient(closest-side, rgb(237, 252, 202), rgba(254, 234, 131, 0)), radial-gradient(closest-side, rgb(197, 248, 241), rgba(170, 142, 245, 0)), radial-gradient(closest-side, rgb(206, 200, 243), rgba(248, 192, 147, 0));
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;

  .wrapper {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85vw;
    height: 90vh;
    border-radius: 20px;
    box-shadow: 0 8px 8px rgba(10, 16, 20, 0.24), 0 0 8px rgba(10, 16, 20, 0.12);
  }

  .mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .rotation {
    width: 100%;
    height: 100%;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .login_form {
    display: flex;
    flex-flow: column nowrap;
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px 30px;
    width: 25%;
    height: 100%;
    backdrop-filter: blur(16px);
    background-color: rgba(255, 255, 255, .75);
    border-left: 1px solid rgba(0,0,0, .1);
    z-index: 12;

    .section {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
      height: 20%;

      .logo {
        width: 80px;
      }

      .header {
        font-size: 24px;
        font-weight: 400;
        letter-spacing: 2px;
      }
    }

    .data {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;

      .login_btn {
        margin: 10px 0 20px;

        button {
          width: 100%;
        }
      }

      .el-form-item {
        width: 100%;

        .el-input__inner {
          height: 5vh;
        }

        .el-form-item__label {
          font-size: 18px;
          font-weight: 600;

          &::before {
            display: none;
          }
        }
      }
    }

    .form_bg {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        position: absolute;
        width: 75%;
        animation-iteration-count: infinite;
        animation-fill-mode: backwards;
      }

      .ball {
        scale: calc(1.1);
        animation-name: ball;
        animation-duration: 3s;
        animation-timing-function: linear;
      }

      .per {
        animation-name: per;
        animation-delay: .4s;
        animation-duration: 2s;
        animation-timing-function: ease-in-out;
      }
    }
  }
}
</style>