/**
* 通用路由
*/
const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    name: 'Login',
    meta: { title: '登录' }
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    name: '404',
    meta: { title: '404' }
  }
]

export default constantRoutes
