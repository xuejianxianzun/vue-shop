import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = window.sessionStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    if (to.path === '/') {
      next('/users')
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
