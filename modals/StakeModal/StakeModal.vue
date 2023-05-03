<template>
  <article :class="$style.stakeModal">
    <h2 :class="$style.stakeModal__title">{{ $t('modals.stake.title') }}</h2>
    <p :class="$style.stakeModal__subtitle">{{ $t('modals.stake.subtitle') }}</p>
    <section :class="$style.stakeModal__content">
      <base-input
        icon="torn"
        ticker="torn"
        button-text="max"
        input-mode="numeric"
        :label="$t('modals.stake.input.label')"
        :info="$t('modals.stake.input.balance', { balance: formattedTokenBalance })"
        :model-value="amount"
        :button-click="onSetMax"
        :error="isAmountInvalid"
        :error-message="$t(amountInvalidReason)"
        @update:modelValue="onChangeAmount"
      />
      <base-button v-if="mismatchNetwork" size="fullWidth" :loading="isChainChanging" @click="onChainChange">
        {{ $t('containers.header.buttons.second') }}
      </base-button>
      <base-button v-else-if="isSign" size="fullWidth" :loading="isProcessing" :disabled="isProceedDisabled" @click="onProceed">
        {{ $t('modals.stake.content.proceed') }}
      </base-button>
      <base-button v-else size="fullWidth" :loading="isProcessing" :disabled="isProceedDisabled" @click="onSign">
        {{ $t(signText) }}
      </base-button>
    </section>

    <button :class="$style.buttonClose" @click="$modal.hide(modalName)">
      <base-icon name="cross" size="fill" />
    </button>
  </article>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import { BigNumber, ethers } from 'ethers'

import { numbers, errors } from '@/constants'
import { debounce, isPositiveNumber } from '@/utilities'

export default {
  name: 'StakeModal',
  props: {
    modalName: {
      type: String,
      required: true,
    },
    onChainChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      amount: '',
      signature: null,
      permitAmount: '',
      approveAmount: '',
      isProcessing: false,
      isPermitError: false,
      isAmountInvalid: false,
      isChainChanging: false,
      amountInvalidReason: '',
      isAmountChecking: false,
      processingErrorMessage: '',
    }
  },
  computed: {
    ...mapState('wallet', ['account']),
    ...mapGetters('wallet', ['formattedTokenBalance', 'tokenBalance', 'mismatchNetwork', 'isConnected']),
    isProceedDisabled() {
      return this.isProcessing || this.isAmountChecking || !isPositiveNumber(this.amountInWei) || this.isAmountInvalid
    },
    signText() {
      return this.showPermitButton ? 'modals.stake.content.sign.second' : 'modals.stake.content.sign.first'
    },
    amountInWei() {
      if (!this.amount) {
        return ''
      }
      return ethers.utils.parseEther(String(this.amount)).toHexString()
    },
    isSign() {
      if (!this.amountInWei) {
        return false
      }

      const isPermitted = Boolean(this.permitAmount) && BigNumber.from(this.permitAmount).eq(this.amountInWei)
      const isApproved = Boolean(this.approveAmount) && BigNumber.from(this.approveAmount).gte(this.amountInWei)

      return isPermitted || isApproved
    },
    showPermitButton() {
      const isValidValues = Boolean(this.amountInWei && this.approveAmount)
      const isApprove = isValidValues && (this.approveAmount.gte(this.amountInWei) || this.isPermitError)
      return !this.amountInWei || !isApprove
    },
  },
  watch: {
    $route: {
      handler() {
        this.$modal.hide(this.modalName)
      },
    },
    isConnected(newValue) {
      if (!newValue) {
        this.$modal.hide(this.modalName)
      }
    },
  },
  async mounted() {
    await this.updateAllowance()
  },
  methods: {
    ...mapActions('application', ['errorHandler']),
    ...mapActions('wallet', ['checkAllowance', 'setApprove', 'getStakePermit']),
    ...mapActions('relayer', ['addStake', 'addStakePermit', 'onStakeApprove', 'getRelayerData']),
    onSetMax() {
      this.onChangeAmount(this.tokenBalance)
    },
    async updateAllowance() {
      try {
        this.isProcessing = true
        this.approveAmount = await this.checkAllowance()
      } catch (err) {
        console.error('updateAllowance error:', this.$t(err.message))
      } finally {
        this.isProcessing = false
      }
    },
    onChangeAmount(value) {
      this.isAmountInvalid = false
      this.amount = value
      this.checkAmountDebouncer()
    },
    checkerHandler() {
      try {
        if (!this.amountInWei) {
          return
        }
        this.isAmountChecking = true
        if (BigNumber.from(this.account.tokenBalance).lt(this.amountInWei)) {
          throw new Error(errors.validation.AMOUNT_GT_TORN_BALANCE)
        }
      } catch (err) {
        this.isAmountInvalid = true
        this.amountInvalidReason = err.message
      } finally {
        this.isAmountChecking = false
      }
    },
    checkAmountDebouncer: debounce(function () {
      this.checkerHandler()
    }, numbers.CHECK_STAKE_AMOUNT_DEBOUNCER),
    async errorWrapper(err) {
      this.isProcessingError = true
      this.processingErrorMessage = await this.errorHandler({ errorMessage: err.message, title: 'notifyTitles.sign' })

      if (this.processingErrorMessage.includes('sign')) {
        this.$notification({ type: 'error', title: 'notifyTitles.permit', text: 'errors.flow.unablePermit' })
        this.isPermitError = true
      }
    },
    async onSign() {
      try {
        this.isProcessing = true
        this.isProcessingError = false
        if (this.showPermitButton) {
          this.signature = await this.getStakePermit(this.amountInWei)
          this.permitAmount = this.amountInWei
        } else {
          const txHash = await this.setApprove()
          this.approveAmount = await this.checkAllowance(txHash)
        }
      } catch (err) {
        await this.errorWrapper(err)
      } finally {
        this.isProcessing = false
      }
    },
    async onProceed() {
      try {
        this.isProcessing = true
        this.isProcessingError = false
        if (this.showPermitButton) {
          await this.addStakePermit({ amount: this.amountInWei, ...this.signature })
          await this.getRelayerData()
          this.$modal.hide(this.modalName)
        } else {
          await this.addStake({ amount: this.amountInWei })
          await this.getRelayerData()
          this.$modal.hide(this.modalName)
        }
      } catch (err) {
        await this.errorWrapper(err)
      } finally {
        this.isProcessing = false
      }
    },
  },
}
</script>

<style lang="scss" module scoped>
@include animation-full-rotate;

.stakeModal {
  margin: 0 auto;
  padding: 2.4rem 0;
  display: flex;
  flex-direction: column;
  @include media('sm') {
    padding: 4.2rem 0 2.4rem;
  }

  &__title {
    margin: 0 0 1rem;
    padding: 0 1.6rem;
    font-weight: $font-weight-bold;
    font-size: 2rem;
    line-height: 1;
    color: $color-white;
    @include media('sm') {
      margin: 0 0 1.2rem;
      padding: 0 2rem;
      font-size: 2.4rem;
    }
  }

  &__subtitle {
    margin: 0 0 1rem;
    padding: 0 1.6rem;
    font-weight: $font-weight-bold;
    font-size: 1.4rem;
    line-height: 1.5;
    color: $color-white;
    @include media('sm') {
      margin: 0 0 1.2rem;
      padding: 0 2rem;
    }
  }

  &__content {
    display: flex;
    height: 14rem;
    padding: 1rem 2rem 0;
    flex-direction: column;
    justify-content: space-between;
  }
}

.buttonClose {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.2rem;
  display: flex;
  width: 2.8rem;
  height: 2.8rem;
  color: $color-grey;
  background-color: $color-transparent;
  border: none;
  border-radius: 0.6rem;
  transition: color $duration-animation-02s ease-in, background-color $duration-animation-02s ease-in;
  cursor: pointer;

  &:hover:not([disabled]),
  &:focus-within:not([disabled]),
  &:active:not([disabled]) {
    color: $color-white;
  }

  @include media('md') {
    top: 1.4rem;
    right: 1.4rem;
  }
}
</style>
