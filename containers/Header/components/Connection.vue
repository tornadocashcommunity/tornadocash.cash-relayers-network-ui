<template>
  <div :class="$style.container">
    <span v-if="isPending" :class="$style.loaderWrap">
      <base-icon name="loader" size="fill" />
    </span>

    <div :class="$style.connection">
      <div :class="$style.connection__buttonGroup">
        <base-button v-if="pendingTxs.length" :class="$style.pendingButton" type="primary" @click="openAccountModal">
          {{ pendingTxs.length }} {{ $t('containers.header.pending') }}
        </base-button>
        <connection-button v-else>
          <base-button :loading="isConnecting" type="primary" @click="openAccountModal">
            {{ shortAddress }}
          </base-button>
        </connection-button>
      </div>
      <base-button v-if="isConnected" size="symbol" :class="$style.buttonExit" @click="onDisconnect">
        <base-icon name="exit" size="symbol" />
      </base-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation, SetupMutation, WalletMutation } from '@/types'

import { links } from '@/constants'
import { AccountModal } from '@/modals/AccountModal'
import { createModalArgs, shortenAddress } from '@/utilities'

import ConnectionButton from '@/components/ConnectionButton.vue'

export default {
  name: 'Connection',
  components: {
    ConnectionButton,
  },
  inject: ['setupProvider'],
  computed: {
    ...mapGetters('transaction', ['pendingTxs']),
    ...mapGetters('wallet', ['isConnected', 'walletAddress', 'isConnecting']),
    isPending() {
      return this.isConnected && this.isPendingTxs
    },
    shortAddress() {
      if (!this.walletAddress) {
        return
      }
      return shortenAddress(this.walletAddress)
    },
  },
  mounted() {
    this.checkPendingTx()
  },
  methods: {
    ...mapActions('transaction', ['checkPendingTx']),
    ...mapMutations('wallet', {
      clearWallet: WalletMutation.CLEAR_PROVIDER,
    }),
    ...mapMutations('setup', {
      clearSetup: SetupMutation.CLEAR_STATE,
    }),
    ...mapMutations('application', {
      clearApplication: ApplicationMutation.CLEAR_STATE,
    }),
    onDisconnect() {
      try {
        this.clearSetup()
        this.clearWallet()
        this.clearApplication()
        this.$router.push(links.home)
      } catch (err) {
        console.log('onReset error:', err.message)
      }
    },
    openAccountModal() {
      const dataModal = createModalArgs(AccountModal, {}, { shiftY: 0, classes: 'modal_top' })
      this.$modal.show(...dataModal)
    },
  },
}
</script>

<style lang="scss" module scoped>
.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connection {
  width: 100%;
  min-width: 17rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &__buttonGroup {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

.loaderWrap {
  margin: 0 2rem 0 0;
  display: flex;
  width: 3.6rem;
  height: 3.6rem;
  @include media('md') {
    width: 6rem;
    height: 6rem;
  }
}

.buttonExit {
  margin: 0 0 0 1rem;
  flex: 0 0 auto;
  @include media('md') {
    margin: 0 0 0 1.6rem;
  }
}
.pendingButton {
  font-size: 1.2rem;
  padding: 0.4rem 1.2rem;
}
</style>

<style lang="scss">
@include animation-full-rotate;
@include animation-full-rotate-negative;

.loader {
  margin: 0;

  &__circle {
    transform-origin: center center;
    animation: animation-full-rotate $duration-animation-1200ms linear infinite;

    &_mini {
      transform-origin: center center;
      animation: animation-full-rotate-negative $duration-animation-1200ms linear infinite;
    }
  }
}
</style>
