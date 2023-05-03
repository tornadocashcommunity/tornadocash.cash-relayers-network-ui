<template>
  <AppContainer :is-processing="isLoading" :on-proceed="onContinue" proceed-text="containers.app.buttons.third">
    <relayer-info
      :relayer-url="relayerUrl"
      :ens-name="ensName"
      :subdomains="successSubdomains"
      :workers="workers"
      :stake="stake"
    />
  </AppContainer>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import { links } from '@/constants'
import { AppContainer } from '@/containers'
import RelayerInfo from '@/components/RelayerInfo'

export default {
  components: { RelayerInfo, AppContainer },
  data: function () {
    return {
      isError: false,
      isLoading: false,
      errorMessage: '',
    }
  },
  computed: {
    ...mapGetters('wallet', ['chainId']),
    ...mapGetters('setup', ['stake', 'relayerUrl', 'ensName', 'workers', 'successSubdomains']),
  },
  methods: {
    ...mapActions('setup', ['register']),
    ...mapActions('application', ['goNextStep']),
    async onContinue() {
      try {
        this.isError = false
        this.isLoading = true

        await this.register()
        this.$router.push(links.relayer)
      } catch (err) {
        this.isError = true
        this.errorMessage = err.message
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
