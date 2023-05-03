<template>
  <section>
    <app-container :on-proceed="onContinue" :is-proceed-disabled="isProceedDisabled">
      <work-area>
        <div :class="$style.stakeArea">
          <base-input
            icon="torn"
            ticker="torn"
            button-text="max"
            input-mode="numeric"
            :label="$t('pages.registration.stake.input.label')"
            :info="$t('pages.registration.stake.input.balance', { balance: formattedTokenBalance })"
            :model-value="String(stake)"
            :button-click="onSetMax"
            :error="isAmountInvalid"
            :error-message="$t(amountInvalidReason, { postfix: `${minStake} TORN` })"
            @update:modelValue="onChangeAmount"
          />
        </div>
        <base-button :loading="isLoading" size="fullWidth" :disabled="isSignDisabled" @click="onSign">
          {{ $t(proceedText) }}
        </base-button>
      </work-area>

      <p :class="$style.content">
        <i18n path="pages.registration.stake.content.first">
          <template #strong>
            <strong>{{ minStake }} TORN</strong>
          </template>
          <template #link>
            <base-link :href="burnLink">{{ $t('pages.registration.stake.links.first') }}</base-link>
          </template>
        </i18n>
      </p>

      <p :class="$style.content">
        <strong>{{ $t('pages.registration.stake.content.second') }}</strong>
      </p>
    </app-container>
  </section>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { BigNumber } from 'ethers'

import { SetupMutation } from '@/types'

import { debounce, toWei } from '@/utilities'
import { AppContainer, WorkArea } from '@/containers'
import { instructions, numbers, pages, steps } from '@/constants'

export default {
  components: { WorkArea, AppContainer },
  data() {
    return {
      isProcessing: false,
      isPermitError: false,
      isAmountInvalid: false,
      amountInvalidReason: '',
      isAmountChecking: false,
      isProcessingError: false,
      processingErrorMessage: '',
      burnLink: instructions.burn,
    }
  },
  computed: {
    ...mapGetters('wallet', ['formattedTokenBalance', 'tokenBalance', 'mismatchNetwork']),
    ...mapGetters('setup', [
      'stake',
      'minStake',
      'isSigned',
      'stakeInWei',
      'approveAmount',
      'isPermitChanged',
      'isEnoughApprove',
    ]),
    isLoading() {
      return this.isProcessing || this.isAmountChecking
    },
    isShowPermitButton() {
      const isValidValues = Boolean(this.stakeInWei && this.approveAmount)
      const isApprove = isValidValues && (BigNumber.from(this.approveAmount).gte(this.stakeInWei) || this.isPermitError)
      return !this.stakeInWei || !isApprove
    },
    proceedText() {
      return this.isShowPermitButton ? 'pages.registration.stake.proceed.second' : 'pages.registration.stake.proceed.first'
    },
    isProceedDisabled() {
      return this.isAmountInvalid || !this.stake || !this.isSigned || !this.isSignDisabled || this.isLoading
    },
    isSignDisabled() {
      return (
        this.isAmountInvalid ||
        !this.isPermitChanged ||
        this.mismatchNetwork ||
        (!this.isShowPermitButton && this.isEnoughApprove)
      )
    },
  },
  async mounted() {
    await this.updateAllowance()
    await this.getMinStake()

    if (!this.stake || BigNumber.from(this.stakeInWei).lt(toWei(this.minStake))) {
      this.onChangeAmount(this.minStake)
    }
  },
  methods: {
    ...mapActions('application', ['goNextStep', 'errorHandler']),
    ...mapMutations('setup', [SetupMutation.SET_STAKE_AMOUNT]),
    ...mapActions('setup', ['getPermitSign', 'setApprove', 'getMinStake', 'checkStake', 'checkAllowance']),
    async updateAllowance() {
      try {
        this.isProcessing = true
        await this.checkAllowance()
      } catch (err) {
        console.error('updateAllowance error:', this.$t(err.message))
      } finally {
        this.isProcessing = false
      }
    },
    onSetMax() {
      this.onChangeAmount(this.tokenBalance)
    },
    onChangeAmount(value) {
      this[SetupMutation.SET_STAKE_AMOUNT](value)
      this.isAmountInvalid = false

      this.checkAmountDebouncer()
    },
    async checkerHandler() {
      try {
        this.isAmountChecking = true
        await this.checkStake()
      } catch (err) {
        this.isAmountInvalid = true
        this.amountInvalidReason = err.message
      } finally {
        this.isAmountChecking = false
      }
    },
    checkAmountDebouncer: debounce(async function () {
      await this.checkerHandler()
    }, numbers.CHECK_STAKE_AMOUNT_DEBOUNCER),
    async onSign() {
      try {
        this.isProcessing = true
        this.isProcessingError = false
        if (this.isShowPermitButton) {
          await this.getPermitSign()
        } else {
          await this.setApprove()
        }
      } catch (err) {
        this.isProcessingError = true
        this.processingErrorMessage = await this.errorHandler({ errorMessage: err.message, title: 'notifyTitles.sign' })

        if (this.processingErrorMessage.includes('sign')) {
          this.$notification({ type: 'error', title: 'notifyTitles.permit', text: 'errors.flow.unablePermit' })
          this.isPermitError = true
        }
      } finally {
        this.isProcessing = false
      }
    },
    onContinue() {
      this.goNextStep(steps[pages.stake].next)
    },
  },
}
</script>

<style lang="scss" module>
.content {
  font-size: 1.3rem;
}
.stakeArea {
  margin-bottom: 1.5rem;
}
</style>
