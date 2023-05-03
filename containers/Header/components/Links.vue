<template>
  <section>
    <nav role="navigation" aria-label="Navigator" :class="[$style.navigation, { [$style.navigation_open]: isOpen }]">
      <router-link
        v-for="item of customLinks"
        :key="item.name"
        :to="item.link"
        :class="$style.navLink"
        :active-class="$style.active"
        @click="closeMenu"
      >
        <span :class="$style.navTitle">{{ item.name }}</span>
      </router-link>
    </nav>

    <button :class="$style.burger" :aria-pressed="String(isOpen)" :aria-label="isOpen ? 'Open' : 'Closed'" @click="toggle">
      <span :class="[$style.burger__line, { [$style.burger__line_open]: isOpen }]"></span>
      <span :class="[$style.burger__line, { [$style.burger__line_open]: isOpen }]"></span>
      <span :class="[$style.burger__line, { [$style.burger__line_open]: isOpen }]"></span>
    </button>
  </section>
</template>
<script>
import { menuLinks } from '@/constants'

export default {
  data: function () {
    return {
      isOpen: false,
    }
  },
  computed: {
    customLinks() {
      return Object.keys(menuLinks).map((k) => ({ name: k, link: menuLinks[k] }))
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
      document.body.style.overflow = !this.isOpen ? 'unset' : 'hidden'
    },
    closeMenu() {
      this.isOpen = false
      document.body.style.overflow = 'unset'
    },
  },
}
</script>

<style lang="scss" module>
.navigation {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding: 3.6rem 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $color-bg;
  visibility: hidden;
  opacity: $opacity-invisible;
  z-index: $zIndex-5;
  &_open {
    visibility: visible;
    opacity: $opacity-default;
  }
  @include media('md') {
    position: static;
    top: auto;
    left: auto;
    right: auto;
    margin: 0 0 0 1.2rem;
    padding: 0;
    display: flex;
    flex: 1 0 auto;
    flex-direction: row;
    justify-content: flex-start;
    height: auto;
    white-space: nowrap;
    background-color: $color-transparent;
    visibility: visible;
    opacity: $opacity-default;
  }
}

.linksNav {
  display: flex;
  align-items: center;
}

.navLink {
  position: relative;
  margin: 0;
  width: 100%;
  padding: 1.1rem 1.2rem;
  width: 100%;
  max-width: 50vw;
  display: block;
  font-weight: $font-weight-regular;
  font-size: 1.4rem;
  line-height: 1.43;
  text-align: center;
  color: $color-white;
  transition: color ease-in $duration-animation-03s;
  outline: none;

  &:hover,
  &:focus {
    color: $color-default;
  }
}
.active {
  color: $color-white;
  background-color: $color-white-02;
  border-radius: 0.6rem;
  @include media('md') {
    background-color: $color-transparent;
    border-radius: 0;
    &::after {
      background-color: $color-link-hover;
      box-shadow: $color-link-hover 0 0 0.6rem;
      transform: scaleX(1);
    }
  }
}
.navTitle {
  margin: 0;
  padding: 0 0 0.4rem;
  text-transform: capitalize;
}

.link {
  position: relative;
  padding: 0 0 0.4rem;
  display: block;
  font-weight: $font-weight-regular;
  font-size: 1.4rem;
  line-height: 1.43;
  color: $color-default;
  transition: color ease-in $duration-animation-03s;
  outline: none;
  &:not(:last-child) {
    margin: 0 0 2rem;
    @include media('md') {
      margin: 0 3.6rem 0 0;
    }
  }
  &:hover,
  &:focus {
    color: $color-primary;
  }
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.6rem;
    display: block;
    height: 0.2rem;
    width: 100%;
    background-color: $color-link-hover;
    border-radius: 1rem;
    box-shadow: $color-link-hover 0 0 0.6rem;
    transform-origin: center top;
    transform: scaleX(0);
    transition: transform $duration-animation-02s ease-in;
  }
  &:hover::after,
  &:focus::after {
    background-color: $color-link-hover;
    box-shadow: $color-link-hover 0 0 0.6rem;
    transform: scaleX(1);
  }
  &__arrow {
    font-size: 1.1rem;
    line-height: 1.2;
  }
  @include media('md') {
    font-size: 1.4rem;
  }
}

.burger {
  position: relative;
  padding: 0;
  margin: 0.4rem;
  display: block;
  width: 4rem;
  height: 3.2rem;
  color: $color-default;
  background-color: $color-transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
  transition: border-color $duration-animation-02s;
  outline: none;
  z-index: $zIndex-5;
  @include media('md') {
    display: none;
  }
  &__line {
    position: absolute;
    left: 50%;
    width: 2rem;
    height: 0.2rem;
    background-color: currentColor;
    transition: all $duration-animation-02s ease-in-out;
    &:nth-of-type(1) {
      top: 1rem;
      transform: translateX(-50%);
    }
    &:nth-of-type(2) {
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: $opacity-default;
      transition: opacity $duration-animation-02s ease-in-out;
    }
    &:nth-of-type(3) {
      bottom: 1rem;
      transform: translateX(-50%);
    }
    &_open {
      &:nth-of-type(1) {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: $color-default;
      }
      &:nth-of-type(2) {
        opacity: $opacity-invisible;
      }
      &:nth-of-type(3) {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        color: $color-default;
      }
    }
  }
}
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: $color-bg;
  visibility: hidden;
  opacity: $opacity-invisible;
  transition: opacity $duration-animation-02s ease-in-out;
  z-index: $zIndex-3;
  &_open {
    visibility: visible;
    opacity: $opacity-default;
  }
  @include media('md') {
    display: none;
  }
}
</style>
