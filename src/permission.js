import router from '@/router'
import { getUser } from '@/utils/auth.js'
import { message } from 'ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置标签title
  document.title = to.meta.title || '最多报一次'
  const hasUser = JSON.parse(getUser())
  if (hasUser) {
    if (to.path === '/login') {
      // 已登录状态进入登录页重定向到首页
      next({ path: '/home' })
      NProgress.done()
    } else {
      if (store.getters.roles === undefined) {
        // 说明还未获取用户的路由信息
        const roles = await store.dispatch('user/getInfo') // 返回页面级的权限路由
        const accessRoutes = await store.dispatch('routes/generateRoutes', roles)
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单
      next()
    } else {
      // 没有登录重定向到登录页
      message.destroy()
      message.warning('登录过期，请重新登录')
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
