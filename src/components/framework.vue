<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/svg/logo.svg" style="padding-left:4px;"></a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="50"
               viewBox="0 0 240 100">
            <image id="号角通信" x="7" y="13" width="198" height="49"
                   xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAAxCAMAAAC20ibOAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAANlBMVEUAAAD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQAAAAC/f/PvAAAAEHRSTlMAQCAQYL/vgFCvMJ+Pz3DfTF8M1AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfiCgIUJTpCMcL6AAADj0lEQVRo3s2a7aKCIAyGpUTy2/u/2nOyYu8GwqA8p/0Tge2BbQyraSrFgNTOoVdBjRdUfH1XRbuR2Hx36zvrma+koaNWB4rZZGZTi43YtW23vEmkvP1dApuW5xrfSEN/EsaAre5YboFyJywJxYUGu5MwRuWAtpErO+Uw5siGm3Mwrp2ufxfqsDmM4TUGdFwzRlqBAbvnJYKxKLHH0Amj+QCWxVtwoWnW3FpXYqzQ1hou0ZWlSboYBvmodynMheM5GDhiFb0xE8+xSR52s7RE83UXP2KiIcvvdiZz21SF0W9MBZODdxNPp6RzZJsLI+IRfizFGOC19+hjknoXpzUQ8jauVkNRjoGZZhSdo+9adpbsfkNBvVL4g0uhVYoqoQYDA3wQnfGd9wU88rftYSslO8pS6KCQDHtV7ZTBQDfZMS6wsktiLgp+hvFKVfMmha06O2BNpoKRqm1YT6C66WnsoWCA974KZRh97ry1IaXJnJkSIyOXwM3yYvY0Rc7mVBhXOccHMV4VUikG8xGjwjByjo9hrL4gr8Agv4L6aLa+ubP2FepWZjzdwXFxGmkhJ4GC+R5h6MerbDB8CNZHhtotke4YGGQld60SkQqCXGdkD0p3ow5j/UoMalhUGKwY+B4Mh48KjBuj2AelPF6esFmxdRjk6vh2dB5vdW4FFRPXms9Uf4PhY35usqnxdZjzEvcrMPzTdBLGFEuY6QtKs5XIHYOK2LYWIxMbjQioWI2bCHEdBikYEGOhK+9szGsx4xgKcVvZiGIMuBhZazTnRg0GxoemtIfuulOcncl1GKla41nrwZG5KigaYWQ+xNmZrDrFw9hIbPhjBBbF/SkYqHPVnBs1GJl7k7xGl2MYrrMuU2VHaL8B+lArxcBvV8prUxJjv1WOcoT2u3I1Bluq9n2M/bWTI/QHeT1G9PZXGxtxDJOU8AqEGOM9ZHA7rWx4jJnBhrczVRwjLTYwCTG0O+gflbe/78Rgv28cYLzrVH+AQbnKHWDQJ67pHzCWe/hgxh5lwz6GrkHtAQZZNfwDhjJT2ahFUYyl+V4MZkIKY74152CkE64Og65NqtLzBAz2jUKLcRM92hKNSoxe6JSWJURXGrZjJ8ZQhGfuyHRRTmHcO3WhWVqMsVFhsOLGyvjKi81hCJmaIoz5Wo7RDfq9rsQAiia/1X0bY85g2J1i2IqkBGOe4PfCQsn8o2n43P+dtPIDDQxf42/EatgAAAAASUVORK5CYII="/>
            <image id="Bugle_Comm" x="8" y="67" width="199" height="30"
                   xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAAAeCAMAAACv6voTAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAANlBMVEUAAAD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQD/nQAAAAC/f/PvAAAAEHRSTlMAv0BgMIAgjxDvr99wn1DPVB4+FAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfiCgIUJTpCMcL6AAABQklEQVRYw+2YbbuCIAyGGbIAMfX//9pzRCwmVAaU0uXzSXJvt8ZGMRhDcbZdDUwSG60FBGreSPZEuRz4lgcPk2FJjrSqUjkKlX5ynBy7cFyq55BkVS2H0tOiXU0FOV3LaIu+c0Q6KmzkCOP+G4xRRfPYQnwO1S4PlzxlcEV9lsONRcKhAbS7aUge4wxvBiTI6O6JZxyr90g5lgoTOHxPvEd4mGdlEJ/ntXIsIfHk+EWOzi7aejkAJ13nbdbXy+ErNu1q4bjym6KHm+9yqOx9/kgvOVQZDvvN1nSeK/NFjt5eN5kcjV1IwtEb6oGzzEc4uD1lGFVing9q8fJV8nxFhEFcLVg+B6BiPocGHJyH4J6GJI7o/yWSftAplsCRqkz3w+jkOJbs/jB7V5GtblObPaa8vjL/mBz2rihNqxZtjvQ2/gDp5G2vb9HRkQAAAABJRU5ErkJggg=="/>
          </svg>
        </a>
      </div>
      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">通信后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
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
      <div class="topbar-account" style="color: #ffffff; font-size: 14px">
        {{username}}
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
        <!-- 导航菜单 加上router属性可以对el-submenu所配置的:index直接路由 -->
        <el-menu :default-active="defaultActiveIndex" class="el-menu-vertical"
                 router @open="handleOpen" @close="handleClose" :collapse="collapsed"
                 background-color="#333744"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <NavMenu :navMenus="navData"></NavMenu>
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
import menu from './menu';
import {mapState} from 'vuex';

export default {
  components: {
    'NavMenu': menu
  },
  data () {
    return {
      defaultActiveIndex: '/dashboard',
      nickname: '',
      collapsed: false,
      navData: []
    };
  },
  computed: mapState({
    username: function (state) {
      if (state.username === '') {
        this.$store.commit('flushData');
      }
      return state.username;
    }
  }),
  methods: {
    _getNavData () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: './../../static/nav.json',
        success: function (res) {
          that.navData = res;
        }
      });
      // axios.get('./../../static/nav.json').then(res => {
      //   this.navData = res.data;
      //   console.log(res.data);
      // });
    },
    handleSelect (index) {
      this.defaultActiveIndex = index;
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed;
    },
    jumpTo (url) {
      this.defaultActiveIndex = url;
      this.$router.push(url); // 用go刷新
    },
    logout () {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  },
  mounted () {
    let user = localStorage.getItem('access-user');
    if (user) {
      user = JSON.parse(user);
      this.nickname = user.nickname || '';
    }
    this._getNavData();
  }
};
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

      .topbar-logo img {
        height: 35px;
        margin-top: 7px;
        margin-left: 2px;
      }

      .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 0px;
      }

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

      .el-menu-vertical:not(.el-menu--collapse) {
        width: 180px;
        min-height: 400px
      }

      .el-menu-vertical {
        display: inline-block;
        text-align: left
      }

      .el-submenu .el-menu-item {
        min-width: 60px;
      }

      .el-menu {
        width: 180px;
        border-right: 0;
      }

      .el-menu--collapse {
        width: 60px;
      }

      /*.el-menu {
        height: 100%; !*写给不支持calc()的浏览器*!
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
      }*/
    }

    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #ecf0f5;
      flex: 1;
      overflow-y: auto;
      padding: 7px;
      /*padding-bottom: 1px;*/
      .content-wrapper {
        /*background-color: #fff;*/
        box-sizing: border-box;
      }
    }

    /*.el-submenu__title:hover{
      background-color: #ecf5ff;
    }*/
  }

  .avatar-wrapper img, .avatar-wrapper {
    height: 50px;
  }

  .menu-option {
    color: white;
    font-size: 18px;
    cursor: pointer;
  }

  .menu-option:hover {
    color: #2587ED;
  }
</style>
