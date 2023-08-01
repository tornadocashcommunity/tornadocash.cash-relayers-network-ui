<template>
  <section :class="$style.wrapper">
    <base-snackbar v-if="shouldTelegramShow" is-open :class="$style.snackbar" icon="info">
      <i18n path="pages.relayer.content.first">
        <template #first>
          <base-link :href="relayerGroup">{{ $t('pages.relayer.links.first') }}</base-link>
        </template>
      </i18n>
    </base-snackbar>

    <h5 :class="$style.wrapper__title">{{ $t('pages.relayer.title') }}</h5>
    <work-area v-if="!isConnected">
      <div :class="$style.message">
        <base-icon name="info" size="xl" />
        <span>{{ $t(connectionText) }}</span>
      </div>
      <connection-button size="fullWidth" />
    </work-area>
    <work-area v-else-if="hasError">
      <div :class="$style.message">
        <base-icon name="error" size="xl" />
        <span>{{ $t(errorText) }}</span>
      </div>
      <base-button size="fullWidth" @click="onRetry"> {{ $t('pages.relayer.error.title') }} </base-button>
    </work-area>
    <relayer-info
      v-else
      :relayer-url="relayerUrl"
      :ens-name="relayerENS"
      :subdomains="successSubdomains"
      :workers="relayerWorkers"
      :stake="relayerBalance"
      stake-text="pages.relayer.stake"
      :is-loading="isLoading"
      editable-stake
    >
      <base-input
        id="#editableStake"
        readonly
        icon="torn"
        ticker="torn"
        input-mode="numeric"
        :label="$t('pages.relayer.stake')"
        :model-value="String(relayerBalance)"
        :loading="isLoading"
        info="Add stake"
        info-icon="plus"
        :button-click="openStakeModal"
      />
    </relayer-info>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { createModalArgs } from '@/utilities'
import { RELAYERS_TELEGRAM } from '@/constants'
import WorkArea from '@/containers/WorkArea/WorkArea'

import { StakeModal } from '@/modals'

export default {
  components: { WorkArea },
  inject: ['onChainChange'],
  data: function () {
    return {
      isLoading: false,
      hasError: false,
      errorText: '',
      relayerGroup: RELAYERS_TELEGRAM,
    }
  },
  computed: {
    ...mapGetters('wallet', ['walletAddress', 'isConnected', 'mismatchNetwork']),
    ...mapGetters('relayer', [
      'relayerUrl',
      'relayerENS',
      'relayerBalance',
      'relayerWorkers',
      'successSubdomains',
      'isRelayerRegistered',
    ]),
    shouldTelegramShow() {
      return this.isConnected && this.isRelayerRegistered
    },
    connectionText() {
      if (this.mismatchNetwork) {
        return 'pages.relayer.connection.second'
      }

      return 'pages.relayer.connection.first'
    },
  },
  watch: {
    isConnected(newValue) {
      if (newValue) {
        this.fetchData()
      }
    },
  },
  async mounted() {
    if (this.walletAddress) {
      await this.fetchData()
    }
  },
  methods: {
    ...mapActions('setup', ['getMinStake']),
    ...mapActions('relayer', ['getRelayerData']),
    async onRetry() {
      this.hasError = false
      await this.fetchData()
    },
    async fetchData() {
      try {
        this.isLoading = true
        await this.getRelayerData()
      } catch (err) {
        this.hasError = true
        this.errorText = err.message
      } finally {
        this.isLoading = false
      }
    },
    openStakeModal() {
      const dataModal = createModalArgs(StakeModal, { clickToClose: false, onChainChange: this.onChainChange })
      this.$modal.show(...dataModal)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  max-width: 38rem;
  width: 100%;
  margin: 0 auto;
  padding: 4rem 0;

  &__title {
    font-size: 2.4rem;
    font-weight: $font-weight-bold;
    color: $color-default;
    margin: 0 0 2rem;
  }
}

.message {
  display: flex;
  margin: 5rem 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  span {
    margin-top: 2rem;
  }
}

.snackbar {
  top: 10rem;
  left: 0;
}
</style>
