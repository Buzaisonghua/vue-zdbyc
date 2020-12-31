import Vue from 'vue'
import App from './App.vue'
import less from 'less' // less
import router from './router'
import './styles/normalize.css'
Vue.use(less)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
