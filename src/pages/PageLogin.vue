<template lang="pug">
form(
    :class="$style['form']"
    @submit="onSubmit"
)
    h1 Вход

    div(:class="$style['form__field']")
        label(for="email") Email
        VInput(
            id="email"
            v-model:value="email"
            :class="$style['input']"
            :readonly="submitting"
            placeholder="yourmail@mail.ru"
        )

    div(:class="$style['form__field']")
        label(for="password") Пароль
        VInput(
            id="password"
            v-model:value="password"
            type="password"
            :class="$style['input']"
            :readonly="submitting"
            placeholder="Ваш пароль"
        )
        div(
            v-if="error.length > 0"
            :class="$style['error']"
        ) {{ error }}

    div(:class="$style['form__footer']")
        VButton(
            type="submit"
            :disabled="!filled || submitting"
        ) Вход
</template>

<script lang="ts">
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'

import UnauthorizedHttpError from '@/api/UnauthorizedHttpError'

import { defineComponent } from 'vue'

import auth from '@/api/auth'

export default defineComponent({
  name: 'PageLogin',

  components: {
    VButton,
    VInput,
  },

  data: () => ({
    email: '',
    password: '',
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

.form {
  padding: 40px 40px 60px;
  flex-shrink: 0;
  background: #{$zs-white};
  border-radius: 15px;
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.16);

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 350px;
    margin-bottom: 20px;
  }

  &__footer {
    margin-top: 40px;
  }
}

.input {
  width: 100%;
}

.error {
  color: #{$zs-red};
}
</style>