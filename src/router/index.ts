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
  const token = window.sessionStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
