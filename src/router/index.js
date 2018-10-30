import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

import Login from '@/views/system/login.vue'; // 登录页面
import Framework from '@/components/framework.vue'; // 主框架
import Dashboard from '@/views/system/dashboard.vue'; // 系统首页
import ChlStatus from '@/views/system/chlStatus.vue'; // // 通道状态
import QueueStatus from '@/views/system/queueStatus.vue'; // 队列状态
import TelConfig from '@/views/system/telConfig.vue'; // 电文配置
import SendLog from '@/views/system/sendLog.vue'; // 系统发送日志
import RecvLog from '@/views/system/recvLog.vue'; // 系统接收日志
import MqLog from '@/views/system/mqLog.vue'; // 后端MQ日志
import SocketLog from '@/views/system/socketLog.vue'; // 后端SOCKET日志

Vue.use(Router);

// 路由配置
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'common',
      redirect: '/dashboard',
      component: Framework,
      children: [
        {path: '/dashboard', name: 'dashboard', component: Dashboard},
        {path: '/chlStatus', name: 'chlStatus', component: ChlStatus},
        {path: '/queueStatus', name: 'queueStatus', component: QueueStatus},
        {path: '/telConfig', name: 'telConfig', component: TelConfig},
        {path: '/sendLog', name: 'sendLog', component: SendLog},
        {path: '/recvLog', name: 'recvLog', component: RecvLog},
        {path: '/mqLog', name: 'mqLog', component: MqLog},
        {path: '/socketLog', name: 'socketLog', component: SocketLog}
      ]
    },
    {path: '/login', name: 'login', component: Login}
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开始进度条
  if (to.path === '/login') {
    next();
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

export default router;
