<template lang="pug">
div.v-pagination(v-if="total_page_count > 1")
    VPaginationButton(
        v-if="page_number > 1"
        @click="prev(1)"
    )
        IconChevronLeft

    VPaginationButton(
        v-for="offset in button_structure.before"
        :key="offset"
        @click="prev(offset)"
    ) {{ page_number - offset }}

    VPaginationButton(active) {{ page_number }}

    VPaginationButton(
        v-for="offset in button_structure.after"
        :key="offset"
        @click="next(offset)"
    ) {{ page_number + offset }}

    VPaginationButton(
        v-if="page_number < total_page_count"
        @click="next(1)"
    )
        IconChevronLeft.v-pagination__icon-next
</template>

<script lang="ts">
import IconChevronLeft from '@/sprites/icons/chevron-left.svg'
import VPaginationButton from './VPaginationButton.vue'

import { defineComponent } from 'vue'

const max_button_count = 5

function isNotNegativeInteger (value: number): boolean {
  return Number.isInteger(value) && value >= 0
}

export default defineComponent({
  name: 'VPagination',

  components: {
    IconChevronLeft,
    VPaginationButton,
  },

  props: {
    total_count: {
      type: Number,
      validator: isNotNegativeInteger,
      required: true,
    },

    page_number: {
      type: Number,
      validator: (value: number) => isNotNegativeInteger(value) && value >= 1,
      default: 1,
    },

    page_size: {
      type: Number,
      validator: isNotNegativeInteger,
      default: 10,
    },
  },

  emits: [
    'update:page_number',
  ],

  computed: {
    total_page_count (): number {
      return Math.ceil(this.total_count / this.page_size)
    },

    button_count (): number {
      return Math.min(this.total_page_count, max_button_count)
    },

    button_structure (): ({
      before: number;
      after: number;
    }) {
      const around = this.button_count - 1
      const before = Math.min(Math.ceil(around / 2), this.page_number - 1)
      const after = around - before

      return { before, after }
    },
  },

  methods: {
    prev (offset: number) {
      this.$emit('update:page_number', Math.max(this.page_number - offset, 0))
    },

    next (offset: number) {
      this.$emit('update:page_number', Math.min(this.page_number + offset, this.total_page_count))
    },
  },
})
</script>

<style lang="scss">
.v-pagination {
  display: flex;
  gap: 4px;

  &__icon-next {
    transform: rotate(180deg);
  }
}
</style>
