import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/index.vue')
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../views/posts.vue'),
    children: [
      {
        path: '/posts',
        name: 'PostsIndex',
        component: () => import('../views/posts/index.vue')
      },
      {
        path: 'edit',
        name: 'PostsEdit',
        component: () => import('../views/posts/edit.vue')
      }
    ]
  },
  {
    path: '/metas',
    name: 'Metas',
    component: () => import('../views/metas.vue'),
    children: [
      {
        path: '/metas/tags',
        name: 'Tags',
        component: () => import('../views/metas/tags.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings.vue')
  },
  {
    path: '/login',
    component: () => import('../views/login.vue')
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
