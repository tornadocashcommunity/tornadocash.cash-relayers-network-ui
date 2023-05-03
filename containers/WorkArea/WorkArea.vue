<template>
  <section :class="$style.workArea">
    <slot />
  </section>
</template>
<script>
export default {}
</script>

<style lang="scss" module>
.workArea {
  min-height: 10rem;
  padding: 1.6rem;
  border-radius: 1rem;
  background-color: $color-bg-primary;
  position: relative;
}
</style>
