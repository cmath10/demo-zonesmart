<template lang="pug">
span(
    :class=`{
        'v-checkbox': true,
        'v-checkbox_checked': checked,
        'v-checkbox_indeterminate': indeterminate,
        'v-checkbox_invalid': invalid,
        'v-checkbox_disabled': disabled,
    }`
    v-bind="$attrs"
)
    input.v-checkbox__input(
        :id="id"
        ref="input"
        :aria-checked="checked ? 'true' : 'false'"
        :aria-invalid="invalid ? 'true' : 'false'"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        type="checkbox"
        @change="onChange"
    )

    span.v-checkbox__state
    span.v-checkbox__checkmark(aria-hidden="true")
        IconIndeterminate(v-if="indeterminate")
        IconCheckmark(v-else-if="checked")
</template>

<script lang="ts">
import type { PropType } from 'vue'

import IconCheckmark from '@/sprites/checkbox/checkmark.svg'
import IconIndeterminate from '@/sprites/checkbox/indeterminate.svg'

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'VCheckbox',

    components: {
        IconCheckmark,
        IconIndeterminate,
    },

    props: {
        id: {
            type: null as unknown as PropType<string | undefined>,
            validator: (id: unknown) => id === undefined || typeof id === 'string' && id.length > 0 && /^[A-Za-z]/.test(id),
            default: undefined,
        },

        name: {
            type: null as unknown as PropType<string | undefined>,
            validator: (id: unknown) => id === undefined || typeof id === 'string',
            default: undefined,
        },

        model: {
            type: null as unknown as PropType<unknown>,
            default: undefined as unknown,
        },

        value: {
            type: null as unknown as PropType<unknown>,
            default: undefined as unknown,
        },

        indeterminate: {
            type: Boolean,
            default: false,
        },

        invalid: {
            type: Boolean,
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        true_value: {
            type: null as unknown as PropType<unknown>,
            default: true,
        },

        false_value: {
            type: null as unknown as PropType<unknown>,
            default: false,
        },

        equals_fn: {
            type: Function as PropType<(a: unknown, b: unknown) => boolean>,
            default: (a: unknown, b: unknown): boolean => a === b,
        },
    },

    emits: [
        'change',
        'update:model',
    ],

    computed: {
        checked (): boolean {
            return Array.isArray(this.model)
                ? this.contains(this.model, this.value)
                : this.equals(this.model, this.true_value)
        },
    },

    methods: {
        click () {
            (this.$refs.input as HTMLInputElement | undefined)?.click()
        },

        focus () {
            (this.$refs.input as HTMLInputElement | undefined)?.focus()
        },

        blur () {
            (this.$refs.input as HTMLInputElement | undefined)?.blur()
        },

        equals (a: unknown, b: unknown): boolean {
            return this.equals_fn.call(null, a, b)
        },

        contains (array: unknown[], value: unknown): boolean {
            return array.some(v => this.equals(v, value))
        },

        calculate (checked: boolean) {
            if (Array.isArray(this.model)) {
                return checked
                    ? (this.contains(this.model, this.value) ? this.model : [...this.model, this.value])
                    : [...this.model].filter(v => !this.equals(v, this.value))
            }

            return checked ? this.true_value : this.false_value
        },

        onChange (event: Event) {
            const input = event.target as HTMLInputElement
            const value = this.calculate(input.checked)

            this.$emit('change', value)
            this.$emit('update:model', value)
        },
    },
})
</script>

<style lang="scss">
@import "../stylesheets/variables";

.v-checkbox {
  display: inline-flex;
  width: 18px;
  height: 18px;
  place-items: center;
  border: 1px solid #{$zs-gray};
  border-radius: 6px;
  position: relative;

  &_checked,
  &_indeterminate {
    background: #{$zs-green};
    border-color: #{$zs-green};
  }

  &__input {
    width: 100%;
    height: 100%;
    appearance: none;
    cursor: pointer;
    outline: none;
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    z-index: 1;

    &[disabled] {
      cursor: not-allowed;
    }
  }

  &__state {
    display: inline-flex;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: inherit;
    background: transparent;
    margin: -1px;
    position: absolute;
    left: 0;
    top: 0;
  }

  &__input:not([disabled]):hover ~ &__state {
    background: rgba(0, 0, 0, 0.05);
  }

  &__input:not([disabled]):active ~ &__state {
    background: rgba(0, 0, 0, 0.1);
  }

  &__checkmark {
    display: inline-flex;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    color: #{$zs-white};

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
