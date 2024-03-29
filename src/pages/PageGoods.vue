<template lang="pug">
div
    h1 Мои товары
    a(
        href="javascript:void(0)"
        @click="logout"
    ) Выйти
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageGoods',

  methods: {
    logout () {
      this.$store.dispatch('UNSET_USER')
    },
  },
})
</script>