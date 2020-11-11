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
    },
    {
      path: '/params',
      name: 'params',
      component: () => import('@/views/GoodsParams.vue'),
      meta: {
        title: '分类参数',
        breadcrumb: [
          {
            title: '商品管理',
            path: ''
          },
          {
            title: '分类参数',
            path: '/params'
          }
        ]
      }
    },
    {
      path: '/goods',
      name: 'goods',
      component: () => import('@/views/GoodsList.vue'),
      meta: {
        title: '商品列表',
        breadcrumb: [
          {
            title: '商品管理',
            path: ''
          },
          {
            title: '商品列表',
            path: '/goods'
          }
        ]
      }
    }, {
      path: '/goods/add',
      name: 'goodsadd',
      component: () => import('@/views/GoodsAdd.vue'),
      meta: {
        title: '添加商品',
        breadcrumb: [
          {
            title: '商品管理',
            path: ''
          },
          {
            title: '添加商品',
            path: '/goods/add'
          }
        ]
      }
    }, {
      path: '/goods/edit/:id',
      name: 'goodsedit',
      component: () => import('@/views/GoodsAdd.vue'),
      meta: {
        title: '编辑商品',
        breadcrumb: [
          {
            title: '商品管理',
            path: ''
          },
          {
            title: '编辑商品',
            path: '/goods/edit/:id'
          }
        ]
      }
    }, {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrderList.vue'),
      meta: {
        title: '订单列表',
        breadcrumb: [
          {
            title: '订单管理',
            path: ''
          },
          {
            title: '订单列表',
            path: '/orders'
          }
        ]
      }
    }, {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Reports.vue'),
      meta: {
        title: '数据报表',
        breadcrumb: [
          {
            title: '数据统计',
            path: ''
          },
          {
            title: '数据报表',
            path: '/reports'
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
