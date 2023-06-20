import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/index.vue')
  },
  {
    path: '/posts',
    name: 'Posts',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/posts.vue'),

    children: [
      {
        path: '/posts',
        name: 'PostsIndex',
        meta: {
          requiresAuth: true
        },
        component: () => import('../views/posts/index.vue')
      },
      {
        path: 'edit',
        name: 'PostsEdit',
        meta: {
          requiresAuth: true
        },
        component: () => import('../views/posts/edit.vue')
      }
    ]
  },
  {
    path: '/metas',
    name: 'Metas',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/metas.vue'),
    children: [
      {
        path: '/metas/tags',
        name: 'Tags',
        meta: {
          requiresAuth: true
        },
        component: () => import('../views/metas/tags.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/settings.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      requiresAuth: false
    },
    component: () => import('../views/login.vue')
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})

export default router
