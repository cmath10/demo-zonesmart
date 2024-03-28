import type { User } from '@/domain/user'

import { Store } from 'vuex'

import * as db from '@/db'

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type State = Nullable<User>

export default new Store({
  state: (): State => ({
    email: null,
    access: null,
    refresh: null,
  }),

  mutations: {
    SET: (state, user: User) => {
      state.email = user.email
      state.access = user.access
      state.refresh = user.refresh
    },

    UNSET: (state) => {
      state.email = null
      state.access = null
      state.refresh = null
    },
  },

  actions: {
    SET: async ({ state, commit }, user: User) => {
      commit('SET', user)

      await db.put(user)
    },

    UNSET: async ({ commit }) => {
      commit('UNSET')

      await db.clear()
    },
  },
})