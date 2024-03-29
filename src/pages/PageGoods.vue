<template lang="pug">
div
    h1 Мои товары
    a(
        href="javascript:void(0)"
        @click="logout"
    ) Выйти
    div
        VCheckbox(v-model:model="checked")
</template>

<script lang="ts">
import VCheckbox from '@/components/VCheckbox.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageGoods',

  components: {
    VCheckbox,
  },

  data: () => ({ checked: false }),

  methods: {
    logout () {
      this.$store.dispatch('UNSET_USER')
    },
  },
})
</script>