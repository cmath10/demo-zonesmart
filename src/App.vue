<template lang="pug">
RouterView(v-if="initialized")
template(v-else) Инициализация...
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    initialized (): boolean {
      return this.$store.getters.initialized
    },
  },
})
</script>
