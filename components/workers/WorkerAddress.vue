<template>
  <div :class="$style.row">
    <base-input :class="$style.row__input" type="text" readonly :model-value="address" />
    <base-button v-if="!withoutBtns" :disabled="isDefaultWorker" size="square" type="dark" @click="onRemoveWorker">
      <base-icon name="trash" />
    </base-button>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

import { numbers } from '@/constants'
import { SetupMutation } from '@/types'

export default {
  props: {
    workerAddress: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: numbers.ZERO,
    },
    withoutBtns: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAddressInvalid: false,
      address: this.workerAddress,
    }
  },
  computed: {
    ...mapGetters('wallet', ['walletAddress']),
    isDefaultWorker() {
      return this.workerAddress === this.walletAddress
    },
  },
  methods: {
    ...mapMutations('setup', [SetupMutation.REMOVE_WORKER]),
    onRemoveWorker() {
      const defaultWorksCount = 1
      this[SetupMutation.REMOVE_WORKER](this.index - defaultWorksCount)
    },
  },
}
</script>

<style lang="scss" module>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  + .row {
    margin-top: 1rem;
  }

  &__input {
    width: 100%;
  }
  button {
    margin-left: 1rem;
    min-width: 3.8rem;
    min-height: 3.8rem;
    span {
      width: 1.4rem;
      height: 1.4rem;
    }
  }
}
</style>
