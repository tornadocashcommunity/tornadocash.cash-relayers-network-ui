<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation, SetupMutation } from '@/types'

import { links, steps } from '@/constants'

export default {
  computed: {
    ...mapGetters('application', ['isCompletedStep', 'currentStep']),
    ...mapGetters('wallet', ['walletAddress', 'isConnected']),
  },
  watch: {
    isConnected(newValue) {
      if (newValue) {
        this.checkRegistration()
      }
    },
    walletAddress(newValue) {
      if (newValue) {
        this.checkRegistration()
      }
    },
  },
  created() {
    if (this.walletAddress) {
      this.checkRegistration()
    }
  },
  beforeUpdate() {
    if (this.currentStep.link !== this.$route.path) {
      this.getCurrentStep()
    }
  },
  async mounted() {
    const currentStep = this.getCurrentStep()

    if (currentStep?.prev) {
      if (!this.isCompletedStep(currentStep.prev)) {
        this.clearSetup()
        this.clearApplication()

        this.$router.push(links.registration)
      }
    }

    await this.getMinStake()
  },
  methods: {
    ...mapActions('setup', ['getMinStake']),
    ...mapActions('relayer', ['checkIsRelayerRegistered']),
    ...mapMutations('setup', {
      clearSetup: SetupMutation.CLEAR_STATE,
    }),
    ...mapMutations('application', {
      clearApplication: ApplicationMutation.CLEAR_STATE,
      setCurrentStep: ApplicationMutation.SET_CURRENT_STEP,
    }),
    async checkRegistration() {
      try {
        const isRegistered = await this.checkIsRelayerRegistered()
        if (isRegistered) {
          this.$router.push(links.relayer)
        }
      } catch (err) {
        console.error('checkRegistration has error:', this.$t(err.message))
      }
    },
    getCurrentStep() {
      const currentStep = Object.values(steps).find((el) => el.link === this.$route.path)

      if (currentStep) {
        this.setCurrentStep(currentStep.current)
      }
      return currentStep
    },
  },
}
</script>
