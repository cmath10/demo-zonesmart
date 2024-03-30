<template lang="pug">
button(
    :type="type"
    :class=`{
        ['v-button']: true,
        ['v-button_' + appearance]: true,
        ['v-button_has-icon']: 'icon' in $slots,
        ['v-button_dense']: dense,
    }`
    :disabled="disabled"
    v-bind="$attrs"
)
    span.v-button__state
    span.v-button__content
        slot(name="icon")
        slot
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VButton',

  props: {
    appearance: {
      type: String as PropType<'primary' | 'secondary'>,
      default: 'primary',
    },

    type: {
      type: String as PropType<HTMLButtonElement['type']>,
      default: 'button',
    },

    dense: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
@import "../stylesheets/variables";

$hovered: var(--v-button-hovered, rgba(0, 0, 0, 0.05));
$pressed: var(--v-button-pressed, rgba(0, 0, 0, 0.10));

.v-button {
  display: inline-flex;
  padding: 0;
  background: #{$zs-green};
  border: none;
  border-radius: 6px;
  color: #{$zs-white};
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  position: relative;

  &_secondary {
    background: #{$zs-gray-button};
    color: #{$zs-blue-dark};
  }

  &[disabled] {
    background: #{$zs-gray-button};
    color: #{$zs-gray};
    cursor: not-allowed;
  }

  &__state {
    display: block;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: inherit;
    z-index: 0;
    margin: -1px;
    position: absolute;
    left: 0;
    top: 0;
  }

  &:hover &__state {
    background: linear-gradient(0deg, #{$hovered} 0%, #{$hovered} 100%);
  }

  &:active &__state {
    background: linear-gradient(0deg, #{$pressed} 0%, #{$pressed} 100%);
  }

  &[disabled] &__state {
    background: transparent;
  }

  &__content {
    display: inline-flex;
    padding: 17px 30px 18px 30px;
    align-items: flex-start;
    gap: 10px;
    border-radius: inherit;
    cursor: inherit;
    z-index: 1;
  }

  &_dense &__content {
    padding: 8px 12px 9px 12px;
  }

  &_has-icon#{&}_dense &__content {
    padding-left: 10px;
  }
}
</style>