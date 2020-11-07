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
Vue.use(vueAxios, axios)

axios.defaults.baseURL = process.env.VUE_APP_API_URL
Vue.config.productionTip = false

axios.interceptors.request.use(
  config => {
    const token = window.sessionStorage.getItem('token') || store.state.token
    config.headers.Authorization = token
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    // 对错误的状态码给出提示
    if (response?.data?.meta.status === 400) {
      console.error(response.config.baseURL)
    }
    return response
  },
  err => {
    return Promise.reject(err.response)
  }
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
