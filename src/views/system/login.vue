<template>
  <div class="login-container">
    <div class="ms-login">
      <div class="ms-title">通信后台管理系统</div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="loginForm.password"
                    @keyup.enter.native="login">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
        </div>
        <p class="login-tips">提示 : 请输入用户名和密码登录通信后台。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名！', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码！', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    login () {
      let that = this;
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$http.openApiAxios({
            url: '/mgr/login',
            method: 'POST',
            params: {
              username: this.loginForm.username,
              password: this.loginForm.password
            },
            success: function (res) {
              if (res.meta.code === 1) {
                window.sessionStorage.setItem('token', res.data.token);
                that.$message.success(res.data.message);
                that.$router.push('/dashboard');
              } else {
                that.$message.error(res.meta.message);
              }
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted () {
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  $width: 100%;
  $height: 100%;
  /*登录框背景色*/
  $rgb: rgba(255, 255, 255, 0.3);
  /*登录背景图*/
  $login-bg: '../../assets/images/login-bg.jpg';
  .login-container {
    position: relative;
    height: 100%;
    width: 100%;
    background-image: url($login-bg);
    background-size: 100%;

    /*标题样式*/
    .ms-title {
      width: $width;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-bottom: 1px solid #ddd;
    }

    .ms-login {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 350px;
      margin: -190px 0 0 -175px;
      border-radius: 5px;
      background: $rgb;
      overflow: hidden;
    }

    .ms-content {
      padding: 30px 30px;
    }

    .login-btn {
      text-align: center;
    }

    .login-btn button {
      width: $width;
      height: 36px;
      margin-bottom: 10px;
    }

    .login-tips {
      font-size: 12px;
      line-height: 30px;
      color: #fff;
    }
  }
</style>
