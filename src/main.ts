import type { State } from '@/store'
import type { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

import './style.css'

import App from './App.vue'

import { createApp } from 'vue'

import router from './router'
import store from './store'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
