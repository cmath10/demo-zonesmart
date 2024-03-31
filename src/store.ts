import type {
  ActionTree,
  GetterTree,
  MutationTree,
} from 'vuex'

import type { User } from '@/domain/user'

import { Store } from 'vuex'

import * as db from '@/db'

export type State = {
  initialized: boolean;
  user: User | null;
}

export const state = (): State => ({
  initialized: false,
  user: null,
})

export const getters = {
  authenticated: state => state.user !== null,
  initialized: state => state.initialized,
  user: state => state.user,
} satisfies GetterTree<State, unknown>

export const mutations = {
  SET_INITIALIZED: (state, initialized: boolean) => state.initialized = initialized,

  SET_USER: (state, user: User) => state.user = user,

  UNSET_USER: (state) => state.user = null,
} satisfies MutationTree<State>

export const actions = {
  SET_USER: async ({ commit }, user: User) => {
    commit('SET_USER', user)

    await db.put(user)
  },

  UNSET_USER: async ({ commit }) => {
    commit('UNSET_USER')

    await db.clear()
  },
} satisfies ActionTree<State, unknown>

export default new Store({
  state,
  getters,
  mutations,
  actions,
})