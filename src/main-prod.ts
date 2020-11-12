import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import vueAxios from 'vue-axios'
import '@/assets/css/resize.css'
import '@/assets/css/global.css'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
Vue.use(vueAxios, axios)

axios.defaults.baseURL = process.env.VUE_APP_API_URL
Vue.config.productionTip = false

axios.interceptors.request.use(
  config => {
    NProgress.start()
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
    NProgress.done()
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

const httpGet = async (url: string, params = {}) => {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(url, {
      params
    })
    if (res.statusText !== 'OK') {
      // 如果返回的数据里有 msg，就作为错误消息
      let msg = ''
      if (res.data?.meta?.msg) {
        msg = res.data?.meta?.msg
        console.error(msg)
      } else {
        msg = `Error: Get ${res.config.baseURL}`
      }
      return reject(msg)
    }

    resolve(res.data)
  })
}

Vue.prototype.$httpGet = httpGet

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
