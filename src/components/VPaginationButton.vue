<template lang="pug">
button(
    :class=`{
        'v-pagination-button': true,
        'v-pagination-button_active': active,
    }`
    :disabled="disabled"
    v-bind="$attrs"
    type="button"
)
    span.v-pagination-button__state
    span.v-pagination-button__content
        slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VPaginationButton',

  props: {
    active: {
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

.v-pagination-button {
  display: inline-flex;
  padding: 0;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  &_active {
    cursor: default;
  }

  &__state {
    --background: transparent;
    display: block;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    background: var(--background);
    border-radius: inherit;
    z-index: 0;
    margin: -1px;
    position: absolute;
    left: 0;
    top: 0;
  }

  &:hover &__state {
    --background: linear-gradient(0deg, #{$zs-hovered} 0%, #{$zs-hovered} 100%);
  }

  &:active &__state {
    --background: linear-gradient(0deg, #{$zs-pressed} 0%, #{$zs-pressed} 100%);
  }

  &_active &__state {
    background: #{$zs-blue-dark};
    opacity: 0.2;
  }

  &__content {
    display: inline-flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    color: #{$zs-black};
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 266.667% */
    text-align: center;
    cursor: inherit;
    z-index: 1;
  }
}
</style>