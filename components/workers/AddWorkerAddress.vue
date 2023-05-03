<template>
  <form :class="$style.container" @submit.prevent="onAddWorker">
    <base-input
      type="text"
      :class="$style.container__input"
      :model-value="address"
      :error="isAddressInvalid"
      :loading="isAddressChecking"
      :error-message="addressInvalidReason"
      placeholder-text="0x0000000000000000000000000000000000000000"
      @update:modelValue="onChangeWorkerAddress"
    />
    <base-button :disabled="isAddDisabled" size="square">
      <base-icon name="plus" size="small" />
    </base-button>
  </form>
</template>
<script>
import { BigNumber } from 'ethers'
import { mapGetters, mapMutations } from 'vuex'

import { SetupMutation } from '@/types'

import { getProvider } from '@/services'
import { errors, numbers } from '@/constants'
import { debounce, isAddress } from '@/utilities'

export default {
  data() {
    return {
      address: '',
      isAddressInvalid: false,
      addressInvalidReason: '',
      isAddressChecking: false,
    }
  },
  computed: {
    ...mapGetters('setup', ['workers']),
    ...mapGetters('wallet', ['chainId']),
    isAddDisabled() {
      return this.isAddressInvalid || this.isAddressChecking || !this.address
    },
  },
  methods: {
    ...mapMutations('setup', [SetupMutation.ADD_WORKER]),
    async onAddWorker() {
      await this.onCheckAddress()
      if (!this.isAddressInvalid) {
        this[SetupMutation.ADD_WORKER](this.address)
        this.isAddressInvalid = false
        this.address = ''
      }
    },
    onChangeWorkerAddress(value) {
      this.address = value
      this.isAddressInvalid = false
      this.checkAddressDebouncer()
    },
    async onCheckAddress() {
      await this.checkIsAddress()
      this.checkIsAddressExist()
    },
    checkIsAddressExist() {
      if (this.workers.includes(this.address)) {
        this.isAddressInvalid = true
        this.addressInvalidReason = this.$t(errors.validation.EXISTING_WORKER)
      }
    },
    async checkIsAddress() {
      try {
        if (!this.address) {
          return
        }

        if (!this.address.startsWith('0x') || !isAddress(this.address)) {
          throw new Error(this.$t(errors.validation.NOT_A_ADDRESS))
        }

        if (BigNumber.from(this.address).isZero()) {
          throw new Error(this.$t(errors.validation.INVALID_ADDRESS))
        }

        const provider = getProvider(this.chainId)
        const isContract = await provider.getIsContract(this.address)

        if (isContract) {
          throw new Error(this.$t(errors.validation.CONTRACT_ADDRESS))
        }
      } catch (err) {
        this.isAddressInvalid = true
        this.addressInvalidReason = err.message
      }
    },
    checkAddressDebouncer: debounce(async function () {
      try {
        this.isAddressChecking = true
        await this.onCheckAddress(this.address)
      } finally {
        this.isAddressChecking = false
      }
    }, numbers.CHECK_WORKER_INPUT_DEBOUNCE),
  },
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  &__input {
    width: 100%;
  }
  button {
    margin-left: 1rem;
    min-width: 3.8rem;
    min-height: 3.8rem;
    font-size: 2.7rem;
    font-weight: 400;
  }
}
</style>
