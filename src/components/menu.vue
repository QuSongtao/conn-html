<template>
  <div>
    <template v-for="navMenu in navMenus">
      <el-submenu v-if = "!navMenu.LEAF" :index ="navMenu.CODE" :key="navMenu.CODE">
        <template slot="title">
          <i :class="navMenu.ICON"></i><span slot="title">{{navMenu.TEXT}}</span>
        </template>
        <!--递归查找子菜单-->
        <NavMenu :navMenus="navMenu.VALUE"></NavMenu>
      </el-submenu>
      <el-menu-item v-else :index="navMenu.URL" :key="navMenu.FM">
        <i :class="navMenu.ICON"></i><span slot="title">{{navMenu.TEXT}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ['navMenus'],
  data () {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
  .el-menu--collapse  span,
  .el-menu--collapse  i.el-submenu__icon-arrow
  {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
</style>
