import PageGoods from '@/pages/PageGoods.vue'
import PageLogin from '@/pages/PageLogin.vue'

import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: PageGoods,
    },
    {
      name: 'Login',
      path: '/login',
      component: PageLogin,
    },
  ],
})

router.beforeEach((to) => {
  if (!store.getters.initialized) {
    return
  }

  if (store.getters.authenticated) {
    if (to.name === 'Login') {
      return { name: 'Home' }
    }
  } else {
    if (to.name !== 'Login') {
      return { name: 'Login' }
    }
  }
})

export default router
