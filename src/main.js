// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import 'normalize.css/normalize.css';
import './assets/style/common.css';
import './assets/iconfont.css';
import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN';
import Direcitve from './directive/directive';
import Filter from './filter/filter';
import Util from './utils/util.class';
import Http from './http/comApiHttp';

// 自定义指令 全局使用
Object.keys(Direcitve).forEach(key => {
  Vue.directive(key, Direcitve[key]);
});
// 自定义过滤器 全局使用
Object.keys(Filter).forEach(key => {
  Vue.filter(key, Filter[key]);
});

Vue.prototype.$util = Util;
Vue.prototype.$http = Http;
Vue.use(ElementUI, {locale});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
