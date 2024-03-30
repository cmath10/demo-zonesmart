<template lang="pug">
div(:class="$style['container']")
    form.v-panel(@submit="onSubmit")
        h1 Вход

        div(:class="$style['field']")
            label(for="email") Email
            VInput(
                id="email"
                v-model:value="email"
                :class="$style['input']"
                :readonly="submitting"
                placeholder="yourmail@mail.ru"
            )

        div(:class="$style['field']")
            label(for="password") Пароль
            VInput(
                id="password"
                v-model:value="password"
                :type="password_hidden ? 'password' : 'text'"
                :class="$style['input']"
                :readonly="submitting"
                placeholder="Ваш пароль"
            )
                template(#trailing)
                    IconEye(
                        v-if="password_hidden"
                        :class="$style['icon-button']"
                        @click="password_hidden = false"
                    )
                    IconEyeClosed(
                        v-else
                        :class="$style['icon-button']"
                        @click="password_hidden = true"
                    )
            div(
                v-if="error.length > 0"
                :class="$style['error']"
            ) {{ error }}

        div(:class="$style['footer']")
            VButton(
                type="submit"
                :disabled="!filled || submitting"
            ) Вход
</template>

<script lang="ts">
import IconEye from '@/sprites/icons/eye.svg'
import IconEyeClosed from '@/sprites/icons/eye-closed.svg'
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'

import UnauthorizedHttpError from '@/api/UnauthorizedHttpError'

import { defineComponent } from 'vue'

import auth from '@/api/auth'

export default defineComponent({
  name: 'PageLogin',

  components: {
    IconEye,
    IconEyeClosed,
    VButton,
    VInput,
  },

  data: () => ({
    email: '',
    password: '',
    password_hidden: true,
    error: '',
    redirecting: false,
    submitting: false,
  }),

  computed: {
    authenticated () {
      return this.$store.getters.authenticated
    },

    filled (): boolean {
      return this.email.length > 0 && this.password.length > 0
    },
  },

  watch: {
    async authenticated () {
      if (this.authenticated) {
        await this.$router.push({ name: 'Home' })
      }
    },

    email () {
      this.error = ''
    },

    password () {
      this.error = ''
    },
  },

  methods: {
    async onSubmit (event: Event) {
      event.preventDefault()

      this.submitting = true

      try {
        this.$store.dispatch('SET_USER', await auth({
          email: this.email,
          password: this.password,
        }))
      } catch (e: unknown) {
        if (e instanceof UnauthorizedHttpError) {
          this.error = e.message === 'No active account found with the given credentials'
            ? 'Для данной пары email/пароль не найден активный аккаунт'
            : e.message
        } else {
          console.error(e)
        }
      } finally {
        this.submitting = false
      }
    },
  },
})
</script>

<style lang="scss" module>
@import "../stylesheets/variables";

.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 350px;
  margin-bottom: 20px;
}

.input {
  width: 100%;
}

.icon-button {
  color: #{$zs-gray};
  cursor: pointer;

  &:hover {
    color: #{$zs-black};
  }
}

.error {
  color: #{$zs-red};
}

.footer {
  margin-top: 40px;
}
</style>