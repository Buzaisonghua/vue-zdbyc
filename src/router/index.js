import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

// 解决push动态路由报错问题
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

// 路由模块
import asyncRoutes from './routes/async-routes'
import HomeRoutes from './routes/constant-routes'

export const routes = [...asyncRoutes, ...HomeRoutes]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
store.dispatch('routes/setRoutes', router.options.routes)
export default router
