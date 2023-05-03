<template>
  <AppContainer :is-processing="isProcessing" :on-proceed="onContinue" :is-proceed-disabled="isProceedDisabled">
    <section>
      <p :class="$style.content">
        {{ $t('pages.registration.requirement.content.first') }}
      </p>
      <p :class="$style.content">
        <i18n path="pages.registration.requirement.content.second">
          <template #link>
            <base-link :href="formulaLink">{{ $t('pages.registration.requirement.links.second') }}</base-link>
          </template>
        </i18n>
      </p>
      <p :class="$style.content">
        {{ $t('pages.registration.requirement.content.third') }}
      </p>
      <base-checkbox :id="checkboxId" :checked="isAgreeWithTerms" label="terms" @click="onSetAgree">
        <span :class="$style.terms">
          {{ $t('pages.registration.requirement.checkbox') }}
        </span>
      </base-checkbox>
    </section>
  </AppContainer>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { ApplicationMutation } from '@/types'

import { pages, steps, instructions } from '@/constants'
import { AppContainer } from '@/containers'

export default {
  components: { AppContainer },
  data() {
    return {
      isProcessing: false,
      checkboxId: 'termsCheckbox',
      formulaLink: instructions.formula,
    }
  },
  computed: {
    ...mapGetters('application', ['isAgreeWithTerms']),
    isProceedDisabled() {
      return !this.isAgreeWithTerms
    },
  },
  mounted() {
    this[ApplicationMutation.SET_CURRENT_STEP](pages.requirements)
  },
  methods: {
    ...mapMutations('application', [ApplicationMutation.SET_TERMS_AGREE, ApplicationMutation.SET_CURRENT_STEP]),
    ...mapActions('application', ['goNextStep']),
    onSetAgree() {
      this[ApplicationMutation.SET_TERMS_AGREE](!this.isAgreeWithTerms)
    },
    onContinue() {
      this.goNextStep(steps[pages.requirements].next)
    },
  },
}
</script>

<style lang="scss" module>
.content {
  font-size: 1.3rem;
}

.attention {
  font-size: 1.2rem;
  font-weight: $font-weight-bold;
}
.terms {
  font-size: 1.2rem;
}
</style>
