<template>
  <article :class="$style.wrapper">
    <base-stepper />
    <section :class="$style.container">
      <section :class="$style.container__content">
        <section>
          <base-button v-if="isShowPrevBtn" type="link" :class="$style.container__back" @click="goPrevStep">
            <base-icon name="back" size="small" />
            {{ $t('containers.app.buttons.first') }}
          </base-button>
          <h5 :class="$style.container__title">{{ $t(stepTitle) }}</h5>
        </section>
        <slot />
        <section :class="$style.actionButtons">
          <connection-button size="fullWidth">
            <base-button size="fullWidth" :loading="isProcessing" :disabled="isProceedDisabled" @click="onProceed">
              {{ $t(proceedText) }}
            </base-button>
          </connection-button>
        </section>
      </section>
    </section>
  </article>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import { pages, steps } from '@/constants'
import ConnectionButton from '@/components/ConnectionButton'

export default {
  components: {
    ConnectionButton,
  },
  props: {
    proceedText: {
      type: String,
      default: 'containers.app.buttons.second',
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    isProceedDisabled: {
      type: Boolean,
      default: false,
    },
    onProceed: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('application', ['currentStep']),
    isShowPrevBtn() {
      return steps[pages[this.currentStep]].prev
    },
    stepTitle() {
      return steps[pages[this.currentStep]].title
    },
  },
  methods: {
    ...mapActions('application', ['goPrevStep']),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  padding: 0 3rem;
  @include media('xl') {
    padding: 0 10rem;
  }
  @include media('lg') {
    padding: 0 5rem;
  }
}

.container {
  width: 100%;
  @include media('sm') {
    border-left: 1px solid #303030;
  }
  &__title {
    font-size: 2.4rem;
    font-weight: $font-weight-bold;
    color: $color-default;
    margin: 0 0 2rem;
  }
  &__content {
    width: 32rem;
    margin: auto;
  }
  &__back {
    margin: 0;
    min-width: 5.5rem !important;
    display: flex;
    justify-content: space-between !important;
    padding: 0.5rem 0 !important;
    height: 2.5rem !important;
    text-decoration: none !important;
  }
}

.actionButtons {
  margin: 2.4rem 0;
  display: flex;
  justify-content: center;
}
</style>
