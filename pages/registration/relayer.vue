<template>
  <app-container :is-processing="isProcessing" :on-proceed="onContinue" :is-proceed-disabled="isProceedDisabled">
    <section>
      <work-area>
        <base-input
          type="url"
          :label="$t('pages.registration.relayer.input.label')"
          :loading="isUrlChecking"
          :model-value="relayerUrl"
          :error="isRelayerInvalid"
          :error-message="relayerInvalidReason"
          placeholder-text="https://mainnet.relayer.com"
          @update:modelValue="onChangeRelayerUrl"
        />
      </work-area>
      <p :class="$style.content">
        <i18n path="pages.registration.relayer.content.first">
          <template #link>
            <base-link :href="instructionLink">{{ $t('pages.registration.relayer.links.first') }}</base-link>
          </template>
        </i18n>
      </p>
    </section>
  </app-container>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ChainId, SetupMutation } from '@/types'

import { tornadoRelayerService } from '@/services'
import { debounce, validation } from '@/utilities'
import { AppContainer, WorkArea } from '@/containers'
import { errors, instructions, numbers, pages, steps } from '@/constants'

export default {
  components: { AppContainer, WorkArea },
  data() {
    return {
      isUrlChecking: false,
      isProcessing: false,
      isRelayerInvalid: false,
      relayerInvalidReason: '',
      instructionLink: instructions.relayer,
    }
  },
  computed: {
    ...mapGetters('setup', ['relayerUrl']),
    ...mapGetters('wallet', ['walletAddress']),
    isProceedDisabled() {
      return this.isRelayerInvalid || !this.relayerUrl || this.isUrlChecking
    },
  },
  async mounted() {
    await this.checkerHandler()
  },
  methods: {
    ...mapActions('application', ['goNextStep']),
    ...mapActions('setup', ['checkRelayer']),
    ...mapMutations('setup', [SetupMutation.SET_RELAYER_URL]),
    onChangeRelayerUrl(value) {
      this[SetupMutation.SET_RELAYER_URL](value)
      this.isUrlChecking = true
      this.isRelayerInvalid = false

      this.checkAddressDebouncer()
    },
    async checkerHandler() {
      try {
        this.isUrlChecking = true

        await this.checkRelayer()
      } catch (err) {
        this.isRelayerInvalid = true
        this.relayerInvalidReason = this.$t(err.message)
      } finally {
        this.isUrlChecking = false
      }
    },
    checkAddressDebouncer: debounce(async function () {
      await this.checkerHandler()
    }, numbers.CHECK_RELAYER_URL_DEBOUNCE),
    onContinue() {
      this.goNextStep(steps[pages.setupRelayer].next)
    },
  },
}
</script>

<style lang="scss" module>
.content {
  font-size: 1.3rem;
}
</style>
