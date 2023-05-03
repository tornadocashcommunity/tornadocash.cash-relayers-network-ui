<template>
  <footer :class="$style.footer">
    <div :class="$style.container">
      <texts />
      <links />
    </div>
  </footer>
</template>

<script>
import { Texts, Links } from './components'

export default {
  components: {
    Texts,
    Links,
  },
}
</script>

<style lang="scss" module>
.footer {
  position: relative;
  padding: 0 0 7rem;
  flex-shrink: 0;
  background-color: $color-transparent;
  @include media('md') {
    padding: 0 0 2rem;
  }
}
.container {
  margin: 0 auto;
  padding: 1.4rem 2rem;
  max-width: 96rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media('sm') {
    flex-direction: row;
    justify-content: space-between;
  }
  @include media('md') {
    padding: 1.4rem 1.8rem;
  }
}
</style>
