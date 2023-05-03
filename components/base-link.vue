<template>
  <a :class="$style.link" :href="href" :target="target">
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      default: '_blank',
    },
  },
}
</script>
<style lang="scss" module>
.link {
  color: $color-link-text;
  color: $color-link-hover;
  &:focus,
  &:hover {
    text-decoration: underline;
  }
}
</style>
