<template lang="pug">
button.v-button(
    :type="type"
    :disabled="disabled"
    v-bind="$attrs"
)
    slot
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    type: {
      type: String as PropType<HTMLButtonElement['type']>,
      default: 'button',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
$zs-green: var(--zs-green, #2ED2BA);

.v-button {
  display: flex;
  padding: 17px 30px 18px 30px;
  align-items: flex-start;
  gap: 10px;
  background: #{$zs-green};
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: "Graphik LCG", sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;

  &:hover {
    background: linear-gradient(
        0deg,
        var(--hovered, rgba(0, 0, 0, 0.05)) 0%,
        var(--hovered, rgba(0, 0, 0, 0.05)) 100%
    ), #{$zs-green};
  }

  &:active {
    background: linear-gradient(
        0deg,
        var(--pressed, rgba(0, 0, 0, 0.10)) 0%,
        var(--pressed, rgba(0, 0, 0, 0.10)) 100%
    ), #{$zs-green};
  }

  &[disabled] {
    background: var(--zs-button-gray, #F2F1F3);
    color: var(--zs-gray, #999999);
    cursor: not-allowed;
  }
}
</style>