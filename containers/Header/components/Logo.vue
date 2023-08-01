<template>
  <div @click="onReset">
    <nuxt-link :to="redirectPath" :class="$style.logoLink" aria-label="Home">
      <span role="none" :class="$style.logoText">Tornado Cash Relayer Registry</span>
      <base-icon name="tornado" size="fill" />
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation, SetupMutation } from '@/types'

import { links } from '@/constants'

export default {
  computed: {
    ...mapGetters('relayer', ['isRelayerRegistered']),
    redirectPath() {
      return this.isRelayerRegistered ? links.relayer : links.home
    },
  },
  methods: {
    ...mapMutations('setup', {
      clearSetup: SetupMutation.CLEAR_STATE,
    }),
    ...mapMutations('application', {
      clearApplication: ApplicationMutation.CLEAR_STATE,
    }),
    onReset() {
      try {
        this.clearSetup()
        this.clearApplication()
      } catch (err) {
        console.log('onReset error:', err.message)
      }
    },
  },
}
</script>

<style lang="scss" module>
.logoLink {
  width: 15.5rem;
  color: $color-primary;
  cursor: pointer;
}

.logoText {
  display: none;
}
</style>
