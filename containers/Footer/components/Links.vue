<template>
  <div :class="$style.container">
    <div :class="$style.social">
      <a
        :href="discourse"
        target="_blank"
        aria-label="Community forum"
        :class="$style.social__link"
        rel="noopener noreferrer nofollow"
      >
        <span :class="$style.social__linkText">Community forum</span>
        <base-icon name="discourse" size="fill" />
      </a>

      <a :href="discord" target="_blank" aria-label="Discord" :class="$style.social__link" rel="noopener noreferrer nofollow">
        <span :class="$style.social__linkText">Discord</span>
        <base-icon name="discord" size="fill" />
      </a>

      <a :href="medium" target="_blank" aria-label="Medium" :class="$style.social__link" rel="noopener noreferrer nofollow">
        <span :class="$style.social__linkText">Medium</span>
        <base-icon name="medium" size="fill" />
      </a>

      <a :href="twitter" target="_blank" aria-label="Twitter" :class="$style.social__link" rel="noopener noreferrer nofollow">
        <span :class="$style.social__linkText">Twitter</span>
        <base-icon name="twitter" size="fill" />
      </a>

      <a :href="telegram" target="_blank" aria-label="Telegram" :class="$style.social__link" rel="noopener noreferrer nofollow">
        <span :class="$style.social__linkText">Telegram</span>
        <base-icon name="telegram" size="fill" />
      </a>

      <a :href="github" target="_blank" aria-label="Github" :class="$style.social__link" rel="noopener noreferrer nofollow">
        <span :class="$style.social__linkText">Github</span>
        <base-icon name="github" size="fill" />
      </a>
    </div>
  </div>
</template>

<script>
import { DISCOURSE, DISCORD, MEDIUM, TWITTER, TELEGRAM, GITHUB } from '@/constants'

export default {
  data: function () {
    return {
      discourse: DISCOURSE,
      discord: DISCORD,
      medium: MEDIUM,
      twitter: TWITTER,
      telegram: TELEGRAM,
      github: GITHUB,
    }
  },
}
</script>

<style lang="scss" module>
.container {
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @include media('sm') {
    margin: 0;
    width: auto;
    flex-direction: row;
    justify-content: flex-start;
  }
}

.social {
  position: relative;
  margin: 0 0 2rem;
  display: flex;
  align-items: center;
  @include media('sm') {
    margin: 0;
  }
  &__link {
    width: 2.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $color-grey-medium;
    border-radius: 1.2rem;
    &:hover,
    &:focus,
    &:active {
      color: $color-white;
    }

    &:not(:last-child) {
      margin-right: 1.8rem;
    }
  }
  &__linkText {
    position: absolute;
    width: 2.4rem;
    text-indent: -1000%;
    overflow: hidden;
  }
}
</style>
