<template>
  <div :class="$style.container">
    <base-button
      v-if="mismatchNetwork"
      :size="size"
      :loading="isChainChanging"
      :class="$style.container__button"
      @click="onChainChange"
    >
      {{ $t('containers.header.buttons.second') }}
    </base-button>
    <base-button
      v-else-if="!isConnected"
      :size="size"
      :loading="isConnecting"
      :class="$style.container__button"
      @click="onConnect"
    >
      <base-icon name="wallet" size="symbol" />
      <span>{{ $t('containers.header.buttons.first') }}</span>
    </base-button>
    <slot v-else />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Connection',
  inject: ['setupProvider', 'onChainChange'],
  props: {
    size: {
      type: String,
      default: 'defaultSize',
      validator(value) {
        return ['defaultSize', 'fullWidth', 'large', 'medium', 'small', 'mini', 'symbol', 'square'].includes(value)
      },
    },
  },
  computed: {
    ...mapGetters('wallet', ['mismatchNetwork', 'isConnected', 'nameProvider', 'isConnecting', 'isChainChanging']),
  },
  methods: {
    ...mapActions('wallet', ['changeChain']),
    async onConnect() {
      try {
        await this.setupProvider(this.nameProvider)
      } catch (err) {
        console.error('initWallet error', this.$t(err.message))
      }
    },
  },
}
</script>

<style lang="scss" module>
.container {
  width: 100%;
  height: 100%;

  &__button {
    margin-left: auto !important;
  }
}
</style>
