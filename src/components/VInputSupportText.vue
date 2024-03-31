<template lang="pug">
div.v-input-support-text
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'VInputSupportText',
})
</script>

<style lang="scss">
@import "../stylesheets/variables";

.v-input-support-text {
  color: #{$zs-gray};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
}
</style>