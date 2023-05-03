<template>
  <app-container :is-processing="isENSChecking" :on-proceed="onContinue" :is-proceed-disabled="isProceedDisabled">
    <section>
      <work-area>
        <base-input
          type="text"
          :label="$t('pages.registration.ens.input.label')"
          :loading="isENSChecking"
          :model-value="ensName"
          :error="isENSInvalid"
          :error-message="$t(ensInvalidReason)"
          placeholder-text="relayer-name.eth"
          @update:modelValue="onChangeENSUrl"
        />

        <ul v-for="subdomain in subdomains" v-show="shouldShowSubdomains" :key="subdomain.name" :class="$style.subdomains">
          <li :class="$style.subdomains__item">
            <span :class="$style.subdomains__title">
              <span :class="$style.subdomains__titleIcon"><base-icon :name="subdomain.icon" size="fill" /></span>
              <span :class="$style.subdomains__titleText">{{ subdomain.title }}</span>
            </span>
            <span :class="[$style.subdomains__status, $style[subdomain.status]]">
              <span :class="$style.subdomains__statusText">{{ subdomain.status }}</span>
              <span :class="$style.subdomains__statusIcon"><base-icon :name="subdomain.status" size="fill" /></span>
            </span>
          </li>
        </ul>
      </work-area>

      <section :class="$style.content">
        <p>
          <i18n path="pages.registration.ens.content.first">
            <template #link>
              <base-link :href="relayerUrl">{{ relayerUrl }}</base-link>
            </template>
          </i18n>
        </p>

        <p>{{ $t('pages.registration.ens.content.second') }}</p>

        <h4>{{ $t('pages.registration.ens.content.third') }}</h4>
        <ul :class="$style.examples">
          <li>mainnet-tornado.xxx.eth</li>
          <li>goerli-tornado.xxx.eth</li>
        </ul>

        <h4>{{ $t('pages.registration.ens.content.fourth') }}</h4>

        <ul :class="$style.examples">
          <li>bsc-tornado.xxx.eth</li>
          <li>gnosis-tornado.xxx.eth</li>
          <li>polygon-tornado.xxx.eth</li>
          <li>optimism-tornado.xxx.eth</li>
          <li>arbitrum-tornado.xxx.eth</li>
          <li>avalanche-tornado.xxx.eth</li>
        </ul>
        <strong>
          <i18n path="pages.registration.ens.content.fifth">
            <template #link>
              <base-link :href="instructionLight">{{ $t('pages.registration.ens.links.second') }}</base-link>
            </template>
          </i18n>
        </strong>
        <h4>{{ $t('pages.registration.ens.content.sixth') }}</h4>

        <ul :class="$style.examples">
          <li>gnosis-nova.xxx.eth</li>
        </ul>
        <strong>
          <i18n path="pages.registration.ens.content.seventh">
            <template #link>
              <base-link :href="instructionNova">{{ $t('pages.registration.ens.links.second') }}</base-link>
            </template>
          </i18n>
        </strong>
      </section>
    </section>
  </app-container>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { SetupMutation } from '@/types'

import { debounce } from '@/utilities'
import { AppContainer, WorkArea } from '@/containers'
import { numbers, pages, steps, instructions } from '@/constants'

export default {
  components: { AppContainer, WorkArea },
  data() {
    return {
      isENSInvalid: false,
      isENSChecking: false,
      ensInvalidReason: '',
      instructionNova: instructions.nova,
      instructionLight: instructions.light,
    }
  },
  computed: {
    ...mapGetters('setup', ['ensName', 'relayerUrl', 'subdomains']),
    isProceedDisabled() {
      return this.isENSInvalid || !this.ensName || this.isENSChecking
    },
    shouldShowSubdomains() {
      const isValidEnsName = !this.isENSInvalid && this.ensName
      return isValidEnsName && !this.isENSChecking && this.subdomains.length
    },
  },
  async mounted() {
    await this.checkerHandler()
  },
  methods: {
    ...mapActions('setup', ['checkEns']),
    ...mapActions('application', ['goNextStep']),
    ...mapMutations('setup', [SetupMutation.SET_ENS_NAME]),
    onChangeENSUrl(value) {
      this[SetupMutation.SET_ENS_NAME](value)

      this.isENSInvalid = false
      this.isENSChecking = true

      this.checkENSDebouncer()
    },
    async checkerHandler() {
      try {
        this.isENSChecking = true

        await this.checkEns()
      } catch (err) {
        this.isENSInvalid = true
        this.ensInvalidReason = err.message
      } finally {
        this.isENSChecking = false
      }
    },
    checkENSDebouncer: debounce(async function () {
      await this.checkerHandler()
    }, numbers.CHECK_RELAYER_URL_DEBOUNCE),
    onContinue() {
      this.goNextStep(steps[pages.setupENS].next)
    },
  },
}
</script>

<style lang="scss" module>
.content {
  font-size: 1.3rem;
  h4 {
    margin-bottom: 0.5rem;
  }
}

.examples {
  padding: 0 2rem;
  margin: 0;
  margin-bottom: 0.5rem;
}

.subdomains {
  margin: 1.6rem 0 0;
  padding: 0;
  font-size: 1.3rem;
  font-weight: $font-weight-regular;
  &__item {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
  }

  &__title,
  &__status {
    display: flex;
    align-items: center;
  }

  &__titleText {
    margin-left: 1rem;
  }

  &__titleIcon {
    height: 2.4rem;
    width: 2.4rem;
  }

  &__statusText {
    margin-right: 1rem;
  }

  &__statusIcon {
    width: 1.6rem;
  }

  &__statusText,
  &__titleText {
    &:first-letter {
      text-transform: uppercase;
    }
  }

  .success {
    color: $color-success;
  }
  .failed {
    color: $color-warning;
  }
  .missing {
    color: $color-link-text;
  }
}
</style>
