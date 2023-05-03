<template>
  <ProviderContainer>
    <HeaderContainer />

    <main :class="$style.main">
      <Nuxt />
    </main>
    <FooterContainer />
  </ProviderContainer>
</template>

<script>
import { mapActions } from 'vuex'

import { ProviderContainer, HeaderContainer, FooterContainer } from '@/containers'

import 'sanitize.css'

export default {
  components: {
    FooterContainer,
    HeaderContainer,
    ProviderContainer,
  },
  mounted() {
    this.$preventMultitabs()
    this.checkPendingTx()
  },
  methods: {
    ...mapActions('transaction', ['checkPendingTx']),
  },
}
</script>

<style lang="scss">
html,
body,
#root {
  font-family: $font-family-main;
}
html {
  box-sizing: border-box;
  height: auto;
  font-size: 62.5%;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
body {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  font-size: 1.6rem;
  line-height: 1.5;
  color: $color-white;
  background-color: $color-bg;
  background-repeat: no-repeat;
}
#__layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
b {
  font-weight: $font-weight-bold;
}
small {
  font-size: 1.4rem;
}
a {
  text-decoration: none;
  transition: all $duration-animation-02s ease-in;
  -webkit-text-decoration-skip: objects;
}
*,
*::before,
*::after {
  box-sizing: inherit;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  -ms-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  -webkit-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  text-rendering: optimizeLegibility;
}
img {
  border-style: none;
}
video {
  width: 100%;
}
</style>

<style lang="scss" module>
.main {
  margin: 0 auto;
  padding: 1rem 0 3rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex: 1 0 auto;
  width: 100%;

  @include media('md') {
    max-width: 96rem;
  }
}
</style>
