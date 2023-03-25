<template>
  <div class="login_container">
    <div class="wrapper">
      <div class="mark"></div>
      <div class="rotation">
        <el-carousel indicator-position="none" arrow="never" height="90vh">
          <el-carousel-item v-for="(src, index) in bgList" :key="index">
            <img :src="src" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- S 登录表单 -->
      <div class="login_form">
        <div class="section">
          <img class="logo" src="~@/assets/logo.png" alt="" />
          <h2 class="header">网上求职与招聘</h2>
        </div>
        <el-form class="data" :rules="rules" :model="form" ref="ruleForm">
          <!-- 登录 -->
          <el-form-item prop="account" label="账号">
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
              show-password
              v-model.trim="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              @click="userSignInOrUp('ruleForm')"
              >用户登录</el-button>
          </el-form-item>
        </el-form>
        <!-- S 表单背景 -->
        <div class="form_bg">
          <img class="ball" src="~@/assets/loginBg/img1.png" alt="" />
          <img class="per" src="~@/assets/loginBg/img2.png" alt="" />
        </div>
        <!-- E 表单背景 -->
      </div>
      <!-- E 登录表单 -->
    </div>
  </div>
</template>

<script>
import { login } from "@/api/user";

export default {
  name: "Login",
  data() {
    return {
      bgList: [],
      form: {
        account: null,
        password: "",
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
  created() {
    let mode = require.context("@/assets/rotation", false);
    mode.keys().forEach((iteam) => {
      this.bgList.push(require(`@/assets/rotation/${iteam.substring(2)}`));
    });
  },
  methods: {
    triggerSign() {
      this.isRegister = !this.isRegister;
      this.form = {};
      this.$refs["ruleForm"].resetFields();
    },
    showMsg(message, type = "warning") {
      this.$message({ showClose: true, type, message });
    },
    // 登录或注册
    userSignInOrUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登录
          this.uLogin();
        } else {
          return false;
        }
      });
    },
    async uLogin() {
      const user = {
        account: this.form.account.toString(),
        password: this.form.password,
      };

      try {
        const { data } = await login(user);
        if (data.code == 300) {
          this.showMsg(data.msg, "error");
        } else {
          this.$store.commit("setUser", data.data);
          this.showMsg("登录成功", "success");

          this.$router.replace("/");
        }
      } catch (error) {
        this.showMsg(error.message, "error");
      }
    },
  },
};
</script>

<style lang="less">
@keyframes movement {
  0%, 100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax, -40vmax -20vmax, 40vmax 60vmax;
  }
  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax, 60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax, 20vmax 10vmax, 30vmax 70vmax;
  }
  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax, -10vmax 10vmax, 40vmax 60vmax;
  }
}
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

  @keyframes move {
    from {
      right: -20%;
    }

    to {
      right: 0;
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
    animation: move 0.75s ease-in-out;

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
        letter-spacing: 3px;
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

    @keyframes ball {
      0%, 100% {
        transform: translateX(0);
      }
      30% {
        transform: translateX(-2px);
      }
      60% {
        transform: translateX(2px);
      }
    }

    @keyframes per {
      0%, 100% {
        transform: translateY(0) rotateZ(0);
      }
      50% {
        transform: translateY(-5px) rotateZ(3deg);
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