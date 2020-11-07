import { RouteConfig } from 'vue-router'
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    },
    children: [{
      path: '/users',
      name: 'users',
      component: () => import('@/views/Users.vue'),
      meta: {
        title: '用户管理',
        breadcrumb: [
          {
            title: '用户管理',
            path: '/users'
          }
        ]
      }
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '用户登录'
    }
  }
]

export default routes
