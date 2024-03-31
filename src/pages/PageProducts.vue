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
                                :model="selected_all"
                                :indeterminate="selected_some"
                                @change="(checked: boolean) => selection = checked ? page.results.map(p => p.id) : []"
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
                        v-if="selection.length"
                        :class="$style['table__batch']"
                    )
                        td(colspan="5")
                            div(style="display: flex; align-items: center; gap: 10px;")
                                | Выбрано {{ selection.length }} из {{ page.results.length }}
                                VButton(appearance="secondary" dense @click="console.log([...selection])")
                                    template(#icon)
                                        IconTrashAlt
                                    | Удалить выбранные
                        td(colspan="2" style="text-align: right;")
                            | Для всех выделенных
                        td
                            VInput(
                                :value="selection_min_price"
                                :class="$style['product-price']"
                                inputmode="numeric"
                                placeholder="\u20BD"
                                dense
                                @input=`applyMinPriceToSelection`
                            )
                        td
                            VInput(
                                :value="selection_max_price"
                                :class="$style['product-price']"
                                inputmode="numeric"
                                placeholder="\u20BD"
                                dense
                                @input="applyMaxPriceToSelection"
                            )
                        td
                    tr(
                        v-for="product in page.results"
                        :key="product.id"
                    )
                        td
                            VCheckbox(v-model:model="selection" :value="product.id")
                        td
                            img(
                                v-if="product.images[0]"
                                :src="product.images[0]"
                                :class="$style['product-image']"
                                alt="Фото"
                            )
                            img(
                                v-else
                                :class="$style['product-image']"
                                src="/no-image-128x128.png"
                                alt="Фото отсутствует"
                                title="Фото отсутствует"
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
                                :value="product.min_price || ''"
                                :class="$style['product-price']"
                                inputmode="numeric"
                                placeholder="\u20BD"
                                dense
                                @input=`(value: number | string) => applyMinPrice(product, value)`
                            )
                        td
                            VInput(
                                :value="product.max_price || ''"
                                :class="$style['product-price']"
                                inputmode="numeric"
                                placeholder="\u20BD"
                                dense
                                @input="(value: number | string) => applyMaxPrice(product, value)"
                            )
                        td
                            IconTrash(
                                :class="[$style['icon-button'], $style['icon-button_danger']]"
                                aria-label="Удалить"
                                role="button"
                            )

        VPagination(
            v-model:page_number="page_number"
            :page_size="page_size"
            :total_count="page.count"
            :class="$style['pagination']"
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
import VPagination from '@/components/VPagination.vue'

import UnauthorizedHttpError from '@/api/UnauthorizedHttpError'

import { defineComponent } from 'vue'

import authRefresh from '@/api/authRefresh'
import fetchProducts from '@/api/fetchProducts'

const column = <O extends object, K extends keyof O>(d: O[], k: K): Set<O[K]> => {
  return d.map(p => p[k])
}
const common = <T>(s: Set<T>) => s.size !== 1 ? '' : Array.from(s)[0] ?? ''
const unique = <O extends object, K extends keyof O>(d: O[], k: K): Set<O[K]> => {
  return new Set(column(d, k))
}

function filterInteger (value: number | string) {
  const parsed = Number.parseInt(String(value))
  return isNaN(parsed) ? null : parsed
}

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
    VPagination,
  },

  data: () => ({
    checked: false,

    page_number: 1,
    page_size: 10,
    page: {
      count: 0,
      next: null,
      previous: null,
      results: [],
    } as Page<Product>,

    selection: [] as Product['id'][],
    selection_max_price: '' as number | string,
    selection_min_price: '' as number | string,
  }),

  computed: {
    user (): User | null {
      return this.$store.getters.user
    },

    selected_all (): boolean {
      return this.selection.length > 0 && this.selection.length === this.page.results.length
    },

    selected_some (): boolean {
      return this.selection.length > 0 && this.selection.length < this.page.results.length
    },

    selected_product_list (): Product[] {
      return this.page.results.filter(p => this.selection.includes(p.id))
    },
  },

  watch: {
    selection () {
      this.selection_max_price = common(unique(this.selected_product_list, 'max_price'))
      this.selection_min_price = common(unique(this.selected_product_list, 'min_price'))
    },
  },

  async created () {
    await this.load(this.page_number)
    this.$watch(() => this.page_number, async () => {
      this.selection = []
      await this.load(this.page_number)
    })
  },

  methods: {
    applyMaxPrice (product: Product, value: number | string) {
      product.max_price = filterInteger(value)

      const max_price_set = unique(this.selected_product_list, 'max_price')
      if (max_price_set.size === 1) {
        this.selection_max_price = product.max_price
      }
    },

    applyMaxPriceToSelection (value: number | string) {
      this.selection_max_price = filterInteger(value)
      this.selected_product_list.forEach(product => {
        product.max_price = this.selection_max_price
      })
    },

    applyMinPrice (product: Product, value: number | string) {
      product.min_price = filterInteger(value)

      const min_price_set = unique(this.selected_product_list, 'min_price')
      if (min_price_set.size === 1) {
        this.selection_min_price = product.min_price
      }
    },

    applyMinPriceToSelection (value: number | string) {
      this.selection_min_price = filterInteger(value)
      this.selected_product_list.forEach(product => {
        product.min_price = this.selection_min_price
      })
    },

    async load (page_number: number) {
      return this.withAuthRefresh(async () => {
        this.page = await fetchProducts({
          access: this.user.access,
          offset: (page_number - 1) * this.page_size,
          limit: this.page_size,
        })
      })
    },

    async authRefresh () {
      await this.$store.dispatch('SET_USER', {
        ...this.user,
        access: await authRefresh(this.user.refresh),
      })
    },

    async withAuthRefresh <T>(operation: () => Promise<T>): Promise<T> {
      try {
        return await operation()
      } catch (e) {
        if (e instanceof UnauthorizedHttpError) {
          try {
            await this.authRefresh()
            return await operation()
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

.pagination {
  margin-top: 20px;
}
</style>
