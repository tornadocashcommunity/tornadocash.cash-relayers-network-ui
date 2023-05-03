<template>
  <header :class="$style.header">
    <notify />
    <div :class="$style.header__navigation">
      <logo />
      <!-- <links /> -->
    </div>

    <div :class="$style.header__features">
      <connection />
    </div>
  </header>
</template>

<script>
import { Notify } from '../Notify'

import Logo from './components/Logo'
// import Links from './components/Links'
import Connection from './components/Connection'

export default {
  components: {
    Logo,
    // Links,
    Notify,
    Connection,
  },
}
</script>

<style lang="scss" module>
.header {
  width: 100%;
  flex-shrink: 0;
  position: relative;
  background-color: $color-transparent;
  position: relative;
  margin: 0 auto 5rem;
  padding: 1.4rem 1.6rem;
  max-width: 96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  @include media('md') {
    padding: 1.4rem 1.8rem;
  }
  &__navigation {
    display: flex;
    width: 100%;

    justify-content: space-between;

    @include media('md') {
      justify-content: flex-start;
    }
  }

  &__features {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 1.2rem 1.6rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-bg;
    border: 0.1rem solid $color-bg-primary;
    border-bottom: none;
    border-radius: 1.2rem 1.2rem 0 0;
    z-index: $zIndex-5;
    flex: 0 0 auto;
    @include media('md') {
      position: static;
      padding: 0;
      width: auto;
      background-color: $color-transparent;
      border: none;
      border-radius: 0;
      z-index: $zIndex-1;
    }
  }
}

.link {
  margin: 0;
  &__text {
    color: white;
    text-decoration: underline;
  }
}
</style>
