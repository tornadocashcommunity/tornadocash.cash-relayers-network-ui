<template>
  <app-container :on-proceed="onContinue" :is-proceed-disabled="isProceedDisabled">
    <section>
      <work-area>
        <add-worker-address />
        <worker-address v-for="(worker, index) of workers" :key="worker + index" :index="index" :worker-address="worker" />
      </work-area>
      <p :class="$style.content">
        {{ $t('pages.registration.workers.content.first') }}
      </p>
      <base-checkbox :id="checkboxId" :checked="isApprovedAllWorkers" label="approveWorkers" @click="onSetApproveWorkers">
        <span :class="$style.terms">{{ $t('pages.registration.workers.content.second') }}</span>
      </base-checkbox>
    </section>
  </app-container>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation } from '@/types'

import { pages, steps } from '@/constants'
import { AppContainer, WorkArea } from '@/containers'

import WorkerAddress from '@/components/workers/WorkerAddress'
import AddWorkerAddress from '@/components/workers/AddWorkerAddress'

export default {
  components: { WorkerAddress, AddWorkerAddress, AppContainer, WorkArea },
  data() {
    return {
      checkboxId: 'workersApproveCheckbox',
    }
  },
  computed: {
    ...mapGetters('setup', ['workers']),
    ...mapGetters('application', ['isApprovedAllWorkers']),
    isProceedDisabled() {
      return this.isDisabled || !this.isApprovedAllWorkers
    },
  },
  methods: {
    ...mapMutations('application', [ApplicationMutation.SET_APPROVE_ALL_WORKERS]),
    ...mapActions('application', ['goNextStep']),
    onSetApproveWorkers() {
      this[ApplicationMutation.SET_APPROVE_ALL_WORKERS](!this.isApprovedAllWorkers)
    },
    onContinue() {
      this.goNextStep(steps[pages.setupWorkers].next)
    },
    setIsContinueDisabled(isDisabled) {
      this.isDisabled = isDisabled
    },
  },
}
</script>
<style lang="scss" module>
.content {
  font-size: 1.3rem;
}
.terms {
  font-size: 1.2rem;
}
</style>
