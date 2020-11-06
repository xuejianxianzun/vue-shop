import { RouteConfig } from 'vue-router'
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    children: [
      {
        path: '/about/:id',
        name: 'AboutDetails',
        component: () => import('@/views/AboutDetails.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
]

export default routes
