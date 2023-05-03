<template>
  <section :class="$style.container">
    <ul :class="$style.list">
      <li
        v-for="step in steps"
        :key="step.stepNumber"
        :class="[
          $style.list__item,
          $style[stepsStatuses[step.name]],
          {
            [$style['list__item--current']]: step.isActive,
          },
        ]"
      >
        <span :class="$style.list__marker"><base-icon :name="step.icon" /></span>
        <span :class="$style.list__itemTitle">{{ $t(step.title) }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { steps, links, numbers } from '@/constants'

export default {
  name: 'Stepper',
  data: function () {
    return {
      steps: Object.entries(steps).map(([name, step], index) => {
        return { ...step, name, stepNumber: index, isActive: false }
      }),
    }
  },
  computed: {
    ...mapGetters('application', ['stepsStatuses', 'isPendingStep']),
  },
  created() {
    this.updateSteps()
  },
  methods: {
    updateSteps() {
      const [{ path }] = this.$route.matched.slice(-numbers.ONE)

      const route = path === '/' ? links.registration : path

      const currentStepIndex = this.steps.findIndex((step) => step.link === route)

      this.steps = this.steps.map((step) => {
        if (step.stepNumber === currentStepIndex) {
          return { ...step, isActive: true }
        }
        return { ...step, isActive: false }
      })
    },
  },
}
</script>

<style lang="scss" module>
.container {
  display: none;

  @include media('sm') {
    display: block;
    width: 35rem;
    height: 100%;
    z-index: 1;
  }
}

.list {
  margin: 0 0 2rem;
  padding: 0;
  display: flex;
  list-style: none;
  flex-direction: column;
  height: 45rem;
  justify-content: space-between;
  &__item {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin: 0 2.4rem 0 0;
    }
    &:last-child {
      &::before {
        display: none;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: calc(100% + 2rem);
      left: 2.5rem;
      width: 0.2rem;
      height: 50%;
      background-color: $color-grey-medium;
    }

    &--current {
      .list__marker,
      .list__itemTitle {
        color: $color-default;
      }
    }
  }
  &__marker {
    position: relative;
    margin: 0 1.2rem 0;
    width: 2.8rem;
    height: 2.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-transparent;
    color: $color-grey-medium;
  }
  &__itemTitle {
    margin: 0;
    font-weight: $font-weight-regular;
    font-size: 1.2rem;
    color: $color-grey-medium;
    text-transform: capitalize;
    word-break: keep-all;
    @include media('sm') {
      font-size: 1.4rem;
    }
  }
}

.completed {
  &::before {
    background-color: $color-primary;
  }
}
</style>
