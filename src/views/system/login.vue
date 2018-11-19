<template>
  <div class="login-container">
    <el-form class="login-form" auto-complete="on" label-position="left" :model="loginForm" ref="loginForm">
      <h3 class="title">号角通信系统登录</h3>
      <el-form-item prop="username" :rules="[{ required: true, message: '请输入账号!', trigger: 'blur' }]">
        <el-input v-model="loginForm.username" type="text" auto-complete="on" placeholder="请输入登录用户名" clearable >
          <template slot="prepend">账    号：</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :rules="[{ required: true, message: '密码不能为空!', trigger: 'change' }]">
        <el-input v-model="loginForm.password" type="password" auto-complete="on" placeholder="请输入登录密码" @keyup.enter.native="login" clearable>
          <template slot="prepend">口    令：</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: ''
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
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
</style>
