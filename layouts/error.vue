<template>
  <article :class="$style.container">
    <base-icon name="notfound" size="fill" />
    <h1>{{ $t('pages.notFound.title') }}</h1>
    <p>{{ $t('pages.notFound.description') }}</p>
    <base-button type="primary" @click="handleRedirect">
      <base-icon name="torn" size="symbol" />
      <span>{{ $t('pages.notFound.buttons.first') }}</span>
    </base-button>
  </article>
</template>
<script>
import { links } from '@/constants'

export default {
  name: 'ErrorPage',
  methods: {
    handleRedirect() {
      this.$router.push(links.home)
    },
  },
}
</script>
<style lang="scss" module>
.container {
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
