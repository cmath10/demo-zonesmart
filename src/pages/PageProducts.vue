<template lang="pug">
div(:class="$style['top']")
    a(
        href="javascript:void(0)"
        style="margin-left: auto;"
        @click="logout"
    ) Выйти

    span(:class="$style['menu']") {{ user?.email }}
        IconCaret(:class="$style['menu__caret']")

div(:class="$style['container']")
    div.v-panel(:class="$style['panel']")
        h2 Мои товары

        p Добавьте товары вашего магазина из одной товарной и ценовой категории (разница цены не больше 15%)
        p Для добавления нескольких товаров введите несколько артикулов через запятую или используя клавишу Enter

        div(:class="$style['filter']")
            label(for="filter") Добавление товаров
            div(:class="$style['filter__controls']")
                div
                    VInput(
                        id="filter"
                        :style="{ width: '746px' }"
                        placeholder="Введите артикул продавца, артикул WB или ссылку на товар"
                    )
                    VInputSupportText(style="margin-top: 4px;")
                        | {{ 'Например ваши товары: ' }}
                        span(:class="$style['dashed']") 119203059
                        | {{ ', ' }}
                        span(:class="$style['dashed']") 124366343
                        | {{ ', ' }}
                        span(:class="$style['dashed']") 59801844
                div(:style="{ flexShrink: 0 }")
                    VButton Добавить

        div(:class="$style['table-wrapper']")
            table(:class="$style['table']")
                thead
                    tr
                        th
                            VCheckbox(
                                :model="selected.length > 0 && selected.length === products.results.length"
                                :indeterminate="selected.length > 0 && selected.length < products.results.length"
                                @change="(checked: boolean) => selected = checked ? products.results.map(p => p.id) : []"
                            )
                        th Фото
                        th Артикул продавца
                        th
                            | Бренд
                            IconFilter(:class="$style['icon-button']")
                        th(style="max-width: 360px;") Название
                        th
                            | Остаток, шт.
                            IconCaret(:class="$style['icon-button']")
                        th
                            | Текущая цена
                            IconCaret(:class="$style['icon-button']")
                        th
                            | Минимальная цена
                            IconCaret(:class="$style['icon-button']")
                        th
                            | Максимальная цена
                            IconCaret(:class="$style['icon-button']")
                        th Удалить
                tbody
                    tr(
                        v-if="selected.length"
                        :class="$style['table__batch']"
                    )
                        td(colspan="5")
                            div(style="display: flex; align-items: center; gap: 10px;")
                                | Выбрано {{ selected.length }} из {{ products.results.length }}
                                VButton(appearance="secondary" dense @click="console.log([...selected])")
                                    template(#icon)
                                        IconTrashAlt
                                    | Удалить выбранные
                        td(colspan="2" style="text-align: right;")
                            | Для всех выделенных
                        td
                            VInput(
                                :class="$style['product-price']"
                                dense
                            )
                        td
                            VInput(
                                :class="$style['product-price']"
                                dense
                            )
                        td
                    tr(
                        v-for="product in products.results"
                        :key="product.id"
                    )
                        td
                            VCheckbox(v-model:model="selected" :value="product.id")
                        td
                            img(
                                v-if="product.images[0]"
                                :src="product.images[0]"
                                :class="$style['product-image']"
                                alt="Фото"
                            )
                        td
                            a(
                                v-if="product.url"
                                :href="product.url"
                                :class="$style['icon-button']"
                                target="_blank"
                            )
                                IconLink
                            template(v-if="product.remote_id") {{ product.remote_id }}
                            template(v-else) &mdash;
                        td
                            template(v-if="product.brand_name") {{ product.brand_name }}
                            template(v-else) &mdash;
                        td(style="max-width: 360px;") {{ product.title }}
                        td {{ product.quantity }}
                        td {{ product.price }}
                        td
                            VInput(
                                :value="product.min_price || 0"
                                :class="$style['product-price']"
                                dense
                            )
                        td
                            VInput(
                                :value="product.max_price || 0"
                                :class="$style['product-price']"
                                dense
                            )
                        td
                            IconTrash(
                                :class="[$style['icon-button'], $style['icon-button_danger']]"
                                aria-label="Удалить"
                                role="button"
                            )
</template>

<script lang="ts">
import type { User } from '@/domain/user'
import type {
  Page,
  Product,
} from '@/api/fetchProducts'

import IconCaret from '@/sprites/icons/caret.svg'
import IconFilter from '@/sprites/icons/filter.svg'
import IconLink from '@/sprites/icons/link.svg'
import IconTrash from '@/sprites/icons/trash.svg'
import IconTrashAlt from '@/sprites/icons/trash-alt.svg'
import VButton from '@/components/VButton.vue'
import VCheckbox from '@/components/VCheckbox.vue'
import VInput from '@/components/VInput.vue'
import VInputSupportText from '@/components/VInputSupportText.vue'

import UnauthorizedHttpError from '@/api/UnauthorizedHttpError'

import { defineComponent } from 'vue'

import authRefresh from '@/api/authRefresh'
import fetchProducts from '@/api/fetchProducts'

export default defineComponent({
  name: 'PageProducts',

  components: {
    IconCaret,
    IconFilter,
    IconLink,
    IconTrash,
    IconTrashAlt,
    VButton,
    VCheckbox,
    VInput,
    VInputSupportText,
  },

  data: () => ({
    checked: false,

    products: {
      count: 0,
      next: null,
      previous: null,
      results: [],
    } as Page<Product>,

    selected: [],
  }),

  computed: {
    user (): User | null {
      return this.$store.getters.user
    },
  },

  async created () {
    try {
      await this.fetchProducts()
    } catch (e: unknown) {
      if (e instanceof UnauthorizedHttpError) {
        try {
          await this.authRefresh()
          await this.fetchProducts()
          return
        } catch (e: unknown) {
          if (e instanceof UnauthorizedHttpError) {
            await this.logout()
            return
          }

          throw e
        }
      }

      throw e
    }
  },

  methods: {
    async authRefresh () {
      await this.$store.dispatch('SET_USER', {
        ...this.user,
        access: await authRefresh(this.user.refresh),
      })
    },

    async fetchProducts () {
      this.products = await fetchProducts({
        access: this.user.access,
      })
    },

    async logout () {
      await this.$store.dispatch('UNSET_USER')
    },
  },
})
</script>

<style lang="scss" module>
@import "../stylesheets/typography";
@import "../stylesheets/variables";

.top {
  display: flex;
  width: 100%;
  height: 80px;
  padding: 27px 30px 28px;
  flex-shrink: 0;
  align-items: center;
  background: #{$zs-white};
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.menu {
  display: inline-flex;
  place-items: center;
  position: relative;
  cursor: pointer;

  &:hover &__caret {
    opacity: 0.8;
  }

  &__popper {
    visibility: hidden;

    &_shown {
      visibility: visible;
    }
  }
}

.container {
  display: flex;
  padding: 30px;
  flex-direction: column;
  align-items: center;
}

.panel {
  width: 100%;
  max-width: 1600px;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;

  &__controls {
    display: flex;
    gap: 20px;
  }
}

.dashed {
  text-decoration: underline 1px dashed;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.20);
  }

  th {
    color: #{$zs-gray};
    padding-top: 17px;
    padding-bottom: 18px;
  }

  th, td {
    padding-left: 10px;
    padding-right: 10px;
    @include text-basic;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  td {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  &__batch {
    background: rgba(19, 38, 57, 0.14);

    td:first-child {
      padding: 15px 10px 15px 20px;
    }
  }
}

.product-image {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.product-price {
  width: 134px;
}

.icon-button {
  display: inline-flex;
  color: #{$zs-gray};
  cursor: pointer;
  text-decoration: none;
  vertical-align: top;

  &:hover {
    color: #{$zs-green};
  }

  &_danger:hover {
    color: #{$zs-red};
  }
}
</style>
