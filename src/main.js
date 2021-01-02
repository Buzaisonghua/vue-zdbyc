import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'regenerator-runtime/runtime' // 兼容
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@/styles/index.less' // 全局样式
import '@/styles/animate.min.css' // 动画库
import '@/permission.js' // 路由守卫（权限判断）
import '@/icons' // icon
import './styles/default-form.less'
import './styles/table-list.less'
import { message } from 'ant-design-vue'

Vue.prototype.$message = message
message.config({
  duration: 2, // 持续时间
  top: document.body.clientHeight / 2 + 'px', // 到页面顶部距离
  maxCount: 1 // 最大显示数, 超过限制时，最早的消息会被自动关闭
})

Vue.use(Antd)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
