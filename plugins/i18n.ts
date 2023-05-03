import Vue from 'vue'
import VueI18n, { DateTimeFormats, NumberFormats } from 'vue-i18n'
import { Plugin } from '@nuxt/types'

import messages from '@/langs'
import { numbers } from '@/constants'

Vue.use(VueI18n)

let lang = 'en'

if (process.browser) {
  const locale = localStorage.getItem('lang') ?? navigator.language.substr(numbers.ZERO, numbers.TWO).toLowerCase()

  // @ts-expect-error
  lang = !messages[locale] ? 'en' : locale
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const dateTimeFormats = {
  en: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
  ru: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
} as Record<string, DateTimeFormats>

const numberFormats = {
  en: {
    compact: {
      notation: 'compact',
    },
  },
  ru: {
    compact: {
      notation: 'compact',
    },
  },
} as NumberFormats

function slavicPluralization(choice: number, choicesLength: number) {
  /**
   * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
   * @param choicesLength {number} an overall amount of available choices
   * @returns a final choice index to select plural word by
   */

  if (choice === numbers.ZERO) {
    return numbers.ZERO
  }

  const teen = choice > numbers.TEN && choice < numbers.TWO * numbers.TEN
  const endsWithOne = choice % numbers.TEN === numbers.ONE

  if (choicesLength < numbers.FOUR) {
    return !teen && endsWithOne ? numbers.ONE : numbers.TWO
  }
  if (!teen && endsWithOne) {
    return numbers.ONE
  }
  if (!teen && choice % numbers.TEN >= numbers.TWO && choice % numbers.TEN <= numbers.FOUR) {
    return numbers.ONE
  }

  return choicesLength < numbers.FOUR ? numbers.TWO : numbers.THREE
}

const pluralizationRules = {
  ru: slavicPluralization,
}

// Create VueI18n instance with options
const i18n: Plugin = ({ app }) => {
  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages,
    silentFallbackWarn: true,
    dateTimeFormats,
    numberFormats,
    pluralizationRules,
  })

  if (lang === 'zh') {
    lang += '-cn'
  }
}

export default i18n
