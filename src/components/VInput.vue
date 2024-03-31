<template lang="pug">
div(
    :class=`{
      'v-input': true,
      'v-input_dense': dense,
      'v-input_focused': focused,
    }`
    @click="$refs.input.focus()"
)
    div.v-input__state
    div.v-input__content
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
        div.v-input__trailing(v-if="'trailing' in $slots")
            slot(name="trailing")
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VInput',

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

    dense: {
      type: Boolean,
      default: false,
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
    'input',
    'update:value',
  ],

  data: () => ({
    focused: false,
  }),

  methods: {
    onInput (event: InputEvent) {
      const input = event.target as HTMLInputElement

      this.$emit('input', input.value)
      this.$emit('update:value', input.value)
    },
  },
})
</script>

<style lang="scss">
@import "../stylesheets/typography";
@import "../stylesheets/variables";

.v-input {
  display: inline-flex;
  background: #{$zs-gray-button};
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25) inset;
  position: relative;

  &__state {
    display: inline-block;
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    border-radius: inherit;
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
  }

  &_focused &__state {
    border-color: #{$zs-blue-dark};
  }

  &__content {
    display: inline-flex;
    width: 100%;
    padding: 12px 20px 13px 20px;
    border-radius: inherit;
    z-index: 1;
  }

  &_dense &__content {
    padding: 7px 10px 8px 10px;
  }

  &__input {
    flex-grow: 1;
    height: 25px;
    padding: 0;
    background: transparent;
    border: none;
    color: #{$zs-black};
    @include text-basic;
    outline: none;

    &::placeholder {
      color: #{$zs-gray};
    }
  }

  &_dense &__input {
    height: 15px;
    line-height: normal;
  }

  &__trailing {
    display: inline-flex;
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }

  &_dense &__trailing {
    width: 15px;
    height: 15px;
  }
}
</style>