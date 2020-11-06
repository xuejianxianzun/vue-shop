import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vueAxios from 'vue-axios'
import '@/assets/css/resize.css'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
import { Message } from 'element-ui'
Vue.use(vueAxios, axios)
Vue.prototype.$message = Message

axios.defaults.baseURL = process.env.VUE_APP_API_URL
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
