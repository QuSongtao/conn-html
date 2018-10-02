import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
Vue.use(Router)

// 登录页面
const Login = (resolve) => {
    import('@/views/system/login').then((m) => {
      resolve(m)
    })
}
// 框架组件
const Common = (resolve) => {
  import('@/components/common').then((m) => {
    resolve(m)
  })
}
// 系统主页面
const dashboard = (resolve) => {
  import('@/views/system/dashboard').then((m) => {
    resolve(m)
  })
}
// 通道状态
const chlStatus = (resolve) => {
  import('@/views/system/chlStatus').then((m) => {
    resolve(m)
  })
}
// 队列状态
const queueStatus = (resolve) => {
  import('@/views/system/queueStatus').then((m) => {
    resolve(m)
  })
}
// 系统发送日志
const sendLog = (resolve) => {
  import('@/views/system/sendLog').then((m) => {
    resolve(m)
  })
}
// 系统接收日志
const recvLog = (resolve) => {
  import('@/views/system/recvLog').then((m) => {
    resolve(m)
  })
}
// 后端MQ日志
const mqLog = (resolve) => {
  import('@/views/system/mqLog').then((m) => {
    resolve(m)
  })
}
// 后端SOCKET日志
const socketLog = (resolve) => {
  import('@/views/system/socketLog').then((m) => {
    resolve(m)
  })
}

// 路由配置
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'common',
      redirect: '/dashboard',
      component: Common,
      children: [
        {path: '/dashboard', name: 'dashboard', component: dashboard},
        {path: '/chlStatus', name: 'chlStatus', component: chlStatus},
        {path: '/queueStatus', name: 'queueStatus', component: queueStatus},
        {path: '/sendLog', name: 'sendLog', component: sendLog},
        {path: '/recvLog', name: 'recvLog', component: recvLog},
        {path: '/mqLog', name: 'mqLog', component: mqLog},
        {path: '/socketLog', name: 'socketLog', component: socketLog}
      ]
    },
    {path: '/login', name: 'login', component: Login}
  ]
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    next()
  } else {
    next()
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
export default router
