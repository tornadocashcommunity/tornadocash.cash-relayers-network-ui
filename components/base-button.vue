<template>
  <button
    v-bind="$attrs"
    :disabled="isDisabled"
    :class="[
      $style.styledButton,
      $style[type],
      $style[size],
      { [$style.fullWidth]: fullWidth },
      { [$style.freeSize]: freeSize },
      { [$style.loading]: loading },
    ]"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    fullWidth: {
      type: Boolean,
      default: false,
    },
    freeSize: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'defaultType',
      validator(value) {
        return ['defaultType', 'primary', 'link', 'dark'].includes(value)
      },
    },
    size: {
      type: String,
      default: 'defaultSize',
      validator(value) {
        return ['defaultSize', 'fullWidth', 'large', 'medium', 'small', 'mini', 'symbol', 'square'].includes(value)
      },
    },
  },
  computed: {
    isDisabled() {
      return this.disabled || this.loading
    },
  },
}
</script>
<style lang="scss" module>
@include animation-full-rotate;

.styledButton {
  position: relative;
  margin: 0;
  width: auto;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-family: $font-family-main;
  font-weight: $font-weight-bold;
  letter-spacing: normal;

  border: none;
  border-radius: 0.4rem;

  transition: all $duration-animation-02s ease-in, text-indent $duration-animation-0s;
  cursor: pointer;
  overflow: hidden;
  z-index: $zIndex-1;
  outline: none;
  &:disabled {
    cursor: not-allowed;
  }
  &::-moz-focus-inner {
    border: none;
  }
}

.fullWidth {
  width: 100%;
}

/* Types */
/* defaultType, primary, link, dark */
.defaultType {
  color: $color-dark-hard;
  background-color: $color-default;
  background-repeat: no-repeat;
  &:disabled {
    color: $color-dark-hard;
    background-color: $color-default-dark;
  }

  &:hover:not([disabled]) {
    background-color: $color-default-light;
  }

  &:active:not([disabled]),
  &:focus-within:not([disabled]) {
    box-shadow: 0 0 0.4rem 0 $color-default;
  }

  &:active:not([disabled]) {
    transform: translateY(0.2rem);
  }
}
.primary {
  color: $color-white;
  background-color: $color-primary;
  &:disabled {
    color: $color-primary-light;
    background-color: $color-black-04;
  }

  &:hover:not([disabled]) {
    background-color: $color-primary-light;
  }

  &:focus-within:not([disabled]),
  &:active:not([disabled]) {
    color: $color-grey-medium;
    background-color: $color-white;
  }
  &:active:not([disabled]) {
    transform: translateY(0.2rem);
  }
}
.link {
  color: $color-link-text;
  background-color: $color-transparent;
  text-decoration: underline;
  &:disabled {
    color: $color-grey-hard;
  }

  &:hover:not([disabled]),
  &:focus-within:not([disabled]),
  &:active:not([disabled]) {
    color: $color-link-hover;
  }
}

.dark {
  border-color: $color-dark;
  background-color: $color-dark;
  &:disabled {
    opacity: 0.55;
    color: $color-grey-hard;
  }

  &:hover:not([disabled]),
  &:focus-within:not([disabled]),
  &:active:not([disabled]) {
    background-color: $color-dark-light;
    border-color: $color-dark-light;
  }
}

/* Sizes */
/* defaultSize, large, medium, small, mini, symbol, square */
.defaultSize {
  padding: 0.4rem 1.6rem;
  min-width: 11rem;
  height: 3.9rem;
  font-size: 1.4rem;
  line-height: 1.1rem;
}
.large {
  padding: 1.2rem 2rem;
  min-width: 14rem;
  height: 5.8rem;
  font-size: 1.8rem;
  line-height: 1.44;
}
.medium {
  padding: 0.8rem 2rem;
  min-width: 5.2rem;
  height: 4rem;
  font-size: 1.6rem;
  line-height: 1.14;
}
.small {
  padding: 0.5rem 1.2rem;
  min-width: 3rem;
  height: auto;
  font-size: 1.4rem;
  line-height: 1.67;
}
.mini {
  padding: 0.4rem;
  min-width: 3.9rem;
  height: 3.9rem;
  font-size: 1.2rem;
  line-height: 1;
}

.fullWidth {
  width: 100%;
  padding: 0.4rem 1.6rem;
  height: 3.8rem;
  font-size: 1.4rem;
  line-height: 1.44;
}

.symbol {
  padding: 0.4rem;
  min-width: 3.9rem;
  max-width: 3.9rem;
  height: 3.9rem;
  font-size: 1.2rem;
  line-height: 1;
}

.freeSize {
  padding: 0;
  min-width: auto;
}

.loading {
  position: relative;
  text-indent: -1000%;
  overflow: hidden;

  > span {
    color: transparent;
  }

  &::before {
    display: none;
  }
  &::after {
    content: '';
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    display: block;
    width: 2rem;
    height: 2rem;
    background-color: $color-transparent;
    background-image: none;
    border: 0.2rem solid $color-white;
    border-color: $color-white $color-transparent $color-white $color-transparent;
    border-radius: 50%;
    animation: animation-full-rotate $duration-animation-1200ms linear infinite;
    opacity: $opacity-default;
  }
}
</style>
