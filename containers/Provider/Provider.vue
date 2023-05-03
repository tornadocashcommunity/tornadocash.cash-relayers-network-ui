<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation, ChainId, SetupMutation, WalletMutation } from '@/types'

import { links } from '@/constants'
import { hexToNumber } from '@/utilities'
import { getWalletProvider } from '@/services'

export default {
  provide() {
    return {
      setupProvider: this.setupProvider,
      onChainChange: this.onChainChange,
    }
  },
  data() {
    return {
      provider: null,
    }
  },
  computed: {
    ...mapGetters('wallet', ['isConnected', 'nameProvider', 'walletAddress']),
  },
  async created() {
    if (this.isConnected) {
      try {
        await this.setupProvider(this.nameProvider)
      } catch {
        this.clearProvider()
      }
    }
    await this.estimateGasWatcher()
  },
  mounted() {
    if (this.isConnected && this.nameProvider) {
      this.checkNetwork()
    }
  },
  methods: {
    ...mapActions('application', ['errorHandler']),
    ...mapActions('gasPrice', ['estimateGasWatcher']),
    ...mapActions('wallet', ['setProvider', 'checkNetwork', 'setWalletParams', 'changeChain']),
    ...mapMutations('wallet', {
      clearProvider: WalletMutation.CLEAR_PROVIDER,
      setLoaderConnection: WalletMutation.SET_LOADER_CONNECTION,
      setProviderConnection: WalletMutation.SET_PROVIDER_CONNECTION,
    }),
    ...mapMutations('setup', {
      clearSetup: SetupMutation.CLEAR_STATE,
    }),
    ...mapMutations('application', {
      clearApplication: ApplicationMutation.CLEAR_STATE,
    }),
    async onChainChange() {
      try {
        await this.changeChain(ChainId.MAINNET)
        await this.setupProvider(this.nameProvider)
      } catch (err) {
        await this.errorHandler({
          errorMessage: err.message,
          title: 'notifyTitles.changeNetwork',
        })
      }
    },
    async setupProvider(key = 'metamask') {
      try {
        this.setLoaderConnection(true)
        this.setProviderConnection(false)
        const provider = getWalletProvider(key)

        const address = await provider.setupProvider()
        const network = await provider.checkNetworkVersion()

        await this.setProvider({ network, name: key })
        await this.setWalletParams(address)

        this.setProviderConnection(true)

        provider.on({
          method: 'chainChanged',
          callback: (network) => {
            this.setProvider({ network: hexToNumber(network), name: this.nameProvider })
          },
        })

        provider.on({
          method: 'accountsChanged',
          callback: ([newAddress]) => {
            if (!newAddress) {
              this.clearProvider()
            } else if (this.isConnected) {
              this.clearSetup()
              this.clearApplication()
              this.setWalletParams(newAddress)

              this.$router.push(links.registration)
            }
          },
        })
      } catch (err) {
        const errorMessage = await this.errorHandler({
          errorMessage: err.message,
          title: 'notifyTitles.connection',
        })
        throw new Error(errorMessage)
      } finally {
        this.setLoaderConnection(false)
      }
    },
  },
}
</script>

<style lang="scss" module>
.container {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
