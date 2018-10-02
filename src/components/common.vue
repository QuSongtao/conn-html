<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/svg/logo.svg" style="padding-left:4px;"></a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <a href="/"><img src="../assets/svg/logos.svg"></a>
      </div>
      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">通信后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <!--<el-dropdown trigger="click">-->
          <!--<span class="el-dropdown-link userinfo-inner"><i class="iconfont icon-user"></i> {{nickname}}  <i-->
            <!--class="iconfont icon-down"></i></span>-->
          <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item>-->
              <!--<div @click="jumpTo('/user/profile')"><span style="color: #555;font-size: 14px;">个人信息</span></div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item>-->
              <!--<div @click="jumpTo('/user/changepwd')"><span style="color: #555;font-size: 14px;">修改密码</span></div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>-->
          <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <!--<img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">-->
            <!--<i class="el-icon-caret-bottom" style="color: white; font-size: 18px"></i>-->
            <i class="el-icon-caret-bottom menu-option"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item>
                主页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">注销</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-menufold" v-show="!collapsed"></i>
          <i class="iconfont icon-menuunfold" v-show="collapsed"></i>
        </div>
        <!--导航菜单-->
        <!--<el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"-->
        <el-menu :default-active="defaultActiveIndex" router @open="handleOpen" @close="handleClose" :collapse="collapsed"
                 text-color="#fff"
                 active-text-color="#2587ED">
          <template v-for="(item,index) in navData" v-if="item.POWER">
            <el-submenu v-if = "!item.LEAF" :index ="index+''" v-bind:key="item.FM" >
              <template slot="title" class="el-submenu__title"><i :class="item.ICON"></i><span>{{item.TEXT}}</span>
              </template>
              <el-menu-item v-for="val in item.VALUE" :index="val.URL" :key="val.URL"
                            ><span slot="title">{{val.TEXT}}</span></el-menu-item>
              <!--<el-menu-item-group>-->
                <!--<router-link-->
                  <!--v-for="(value,itemIndex) in item.VALUE"-->
                  <!--v-bind:key="value.FP"-->
                  <!--:to="value.URL"-->
                <!--&gt;-->
                  <!--<el-menu-item :index="index+'-'+itemIndex">{{value.TEXT}}</el-menu-item>-->
                <!--</router-link>-->
              <!--</el-menu-item-group>-->
            </el-submenu>
            <el-menu-item v-else-if="item.LEAF" :index="item.URL" :key="item.FM"
                          >
              <!--:class="$route.path==item.URL?'is-active':''"-->
              <i :class="item.ICON"></i><span slot="title">{{item.TEXT}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      defaultActiveIndex: '0',
      nickname: '',
      collapsed: false,
      isCollapse: false,
      navData: []
    }
  },
  methods: {
    _getNavData () {
      axios.get('./../../static/nav.json').then(res => {
        this.navData = res.data
        console.log(res.data)
      })
    },
    handleSelect (index) {
      this.defaultActiveIndex = index
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    jumpTo (url) {
      this.defaultActiveIndex = url
      this.$router.push(url) // 用go刷新
    },
    logout () {
      this.$router.push('/login')
    }
  },
  mounted () {
    let user = localStorage.getItem('access-user')
    if (user) {
      user = JSON.parse(user)
      this.nickname = user.nickname || ''
    }
    this._getNavData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;
      .topbar-btn {
        color: #fff;
        height: 50px;
      }
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
      }
      .topbar-logo img {height: 35px;margin-top: 7px;margin-left: 2px;}
      .topbar-logos img {height: 40px;margin-top: 5px;margin-left: 0px;}
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }
    aside {
      min-width: 50px;
      background: #333744;
      &::-webkit-scrollbar {
        display: none;
      }
      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }
      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #333744;
        border-right: 0px;
      }
      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }
      .el-menu .el-menu-item, .el-submenu {
        height: 46px;
        line-height: 46px;
        color: white;
        background-color: #333744;
      }
      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #4a5064 !important;
      }
    }
    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }
    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
    /*.el-submenu__title:hover{
      background-color: #ecf5ff;
    }*/
  }
  .avatar-wrapper img,.avatar-wrapper{
    height: 50px;
  }
  .menu-option{
    color: white; font-size: 18px; cursor: pointer;
  }
  .menu-option:hover{
    color: #2587ED;
  }
</style>
