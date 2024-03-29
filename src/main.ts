import type { State } from '@/store'
import type { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

import './stylesheets/app.scss'

import App from './App.vue'

import { createApp } from 'vue'

import * as db from './db'
import router from './router'
import store from './store'

db.get().then(user => {
  if (user) {
    store.commit('SET_USER', user)
  }

  store.commit('SET_INITIALIZED', true)
})

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app').$watch(() => [
  store.getters.authenticated,
  store.getters.initialized,
], async () => {
  if (!store.getters.authenticated && store.getters.initialized) {
    await router.push({ name: 'Login' })
  }
}, { immediate: true })
