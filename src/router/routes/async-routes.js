/**
 * 需要权限路由
 */
import Layout from '@/layout/index.vue'
// import Page from '@/layout/page.vue'
const HomeRoutes = [
  /* 首页 */
  {
    path: '/',
    component: Layout,
    hidden: true, // 是否在导航中显示
    only: true, // 是否是一级路由
    defaultKey: 'Home', // 导航跳转到的名称
    name: 'Home',
    meta: {
      title: '首页',
      icon: 'home'
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/home'),
        meta: {
          title: '首页',
          icon: 'home'
        }
      }
    ]
  }
]
export default HomeRoutes
//   /* 任务发布 */
//   {
//     path: '/task',
//     component: Layout,
//     redirect: '/task/un',
//     hidden: true,
//     name: 'Task',
//     meta: {
//       title: '任务发布',
//       icon: 'task'
//     },
//     children: [
//       {
//         path: 'un',
//         component: () => import('@/views/taskReleace/un'),
//         name: 'TaskUn',
//         meta: {
//           title: '未发布任务',
//           icon: 'nav',
//           bread: [
//             {
//               name: '任务发布',
//               path: '/task'
//             },
//             {
//               name: '未发布任务',
//               path: '/task/un'
//             }
//           ]
//         }
//       },
//       {
//         path: 'on',
//         component: () => import('@/views/taskReleace/on'),
//         name: 'TaskOn',
//         meta: {
//           title: '已发布任务',
//           icon: 'device-list',
//           bread: [
//             {
//               name: '任务发布',
//               path: '/task'
//             },
//             {
//               name: '已发布任务',
//               path: '/task/on'
//             }
//           ]
//         }
//       },
//       {
//         path: 'complete',
//         component: () => import('@/views/taskReleace/complete'),
//         name: 'TaskComplete',
//         meta: {
//           title: '已完成任务',
//           icon: 'device-list',
//           bread: [
//             {
//               name: '任务发布',
//               path: '/task'
//             },
//             {
//               name: '已完成任务',
//               path: '/task/complete'
//             }
//           ]
//         }
//       },
//       {
//         path: 'all',
//         component: () => import('@/views/taskReleace/all'),
//         name: 'TaskAll',
//         meta: {
//           title: '全部任务',
//           icon: 'device-list',
//           bread: [
//             {
//               name: '任务发布',
//               path: '/task'
//             },
//             {
//               name: '全部任务',
//               path: '/task/all'
//             }
//           ]
//         }
//       }
//     ]
//   },
//   /* 模块管理 */
//   {
//     path: '/power',
//     component: Layout,
//     hidden: true,
//     only: true,
//     redirect: '/power/index',
//     defaultKey: 'Power',
//     meta: {
//       title: '模板管理',
//       icon: 'power'
//     },
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/power'),
//         name: 'Power',
//         meta: {
//           title: '模板管理',
//           bread: [
//             {
//               name: '模板管理',
//               path: '/home'
//             }
//           ]
//         }
//       }
//     ]
//   },
//   /* 表单 */
//   {
//     path: '/form',
//     component: Page,
//     hidden: false,
//     children: [
//       {
//         // 新建模板
//         path: 'setNewTemplate',
//         component: () => import('@/views/power/form/setNewTemplateForm.vue'),
//         meta: {
//           title: '新建模板'
//         }
//       },
//       {
//         // 模板处理
//         path: 'templateDetails',
//         component: () => import('@/views/power/form/templateDetalisForm.vue'),
//         meta: {
//           title: '模板处理'
//         }
//       },
//       {
//         // 下发任务
//         path: 'addTask',
//         component: () => import('@/views/taskReleace/new/addTask.vue'),
//         meta: {
//           title: '下发任务'
//         }
//       },
//       {
//         // 下发任务处理页面
//         path: 'taskDetails',
//         component: () => import('@/views/taskReleace/details'),
//         meta: {
//           title: '任务处理'
//         }
//       },
//       {
//         // 下发任务未发布任务详情
//         path: 'taskDetailsUn',
//         component: () => import('@/views/taskReleace/details/un'),
//         meta: {
//           title: '未发布任务详情'
//         }
//       },
//       {
//         // 下发任务已发布任务详情
//         path: 'taskDetailsOn',
//         component: () => import('@/views/taskReleace/details/on'),
//         meta: {
//           title: '已发布任务详情'
//         }
//       },
//       {
//         // 下发任务处理页面
//         path: 'taskDetailsOk',
//         component: () => import('@/views/taskReleace/details/ok'),
//         meta: {
//           title: '审核纪录'
//         }
//       }
//     ]
//   }
// ]
export const asyncConfig = [
  /* 权限配置 */
  {
    path: '/config',
    component: Layout,
    hidden: true,
    only: true,
    meta: {
      title: '权限配置',
      icon: 'config'
    },
    defaultKey: 'Config',
    children: [
      {
        path: 'index',
        component: () => import('@/views/configuraction'),
        name: 'Config',
        meta: {
          title: '权限配置',
          icon: 'config',
          bread: [
            {
              name: '权限配置',
              path: '/config'
            }
          ]
        }
      }
    ]
  }
]

// export default asyncRoutes
