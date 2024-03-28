<template lang="pug">
div(
    :class=`{
      'v-input': true,
      'v-input_focused': focused,
    }`
    @click="$refs.input.focus()"
)
    input.v-input__input(
        :id="id"
        ref="input"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
    )
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: {
      type: null as PropType<string | null>,
      default: null,
    },

    type: {
      type: String as PropType<HTMLInputElement['type']>,
      default: 'text',
    },

    value: {
      type: [Number, String],
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'blur',
    'focus',
    'update:value',
  ],

  data: () => ({
    focused: false,
  }),

  methods: {
    onInput (event: InputEvent) {
      const input = event.target as HTMLInputElement

      this.$emit('update:value', input.value)
    },
  },
})
</script>

<style lang="scss">
$dark-blue: var(--zs-dark-blue, #132639);

.v-input {
  display: inline-flex;
  padding: 12px 28px 13px 28px;
  background: var(--zs-button-gray, #F2F1F3);
  border: 1px solid transparent;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25) inset;

  &_focused {
    border-color: #{$dark-blue};
  }

  &__input {
    flex-grow: 1;
    height: 25px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--zs-black, #000000);
    font-family: "Graphik LCG", sans-serif;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 25px;
    outline: none;

    &::placeholder {
      color: var(--zs-gray, #999);
    }
  }
}
</style>