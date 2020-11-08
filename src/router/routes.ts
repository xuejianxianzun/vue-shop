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
    },
    {
      path: '/rights',
      name: 'rights',
      component: () => import('@/views/Rights.vue'),
      meta: {
        title: '权限列表',
        breadcrumb: [
          {
            title: '权限管理',
            path: ''
          },
          {
            title: '权限列表',
            path: '/rights'
          }
        ]
      }
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('@/views/Roles.vue'),
      meta: {
        title: '角色管理',
        breadcrumb: [
          {
            title: '权限管理',
            path: ''
          },
          {
            title: '角色管理',
            path: '/roles'
          }
        ]
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/GoodsCate.vue'),
      meta: {
        title: '商品分类',
        breadcrumb: [
          {
            title: '商品管理',
            path: ''
          },
          {
            title: '商品分类',
            path: '/categories'
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
