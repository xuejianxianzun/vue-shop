import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && window.sessionStorage.getItem(process.env.VUE_APP_TOKEN_STORE) === null) {
    next('/login')
  } else {
    next()
  }
})

export default router
