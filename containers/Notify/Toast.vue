<template>
  <div class="notifyLib" :class="[{ [$style.modalNotify]: isModalExist, [$style.notify]: !isModalExist }]">
    <div :class="$style.notify__content">
      <h4
        :class="[
          $style.notify__title,
          {
            [$style[item.type]]: !Boolean(link),
            [$style.notify__smallTitle]: Boolean(item.text),
          },
        ]"
      >
        {{ $t(item.title) }}
      </h4>
      <p
        :class="[
          $style.notify__text,
          {
            [$style.notify__smallText]: Boolean(item.title),
          },
        ]"
      >
        {{ getText(item.text) }}
        <span v-if="link" :class="$style.link">
          <a
            :class="[
              $style.link__text,
              {
                [$style[item.type]]: Boolean(link),
              },
            ]"
            :href="link"
            target="_blank"
            rel="noreferrer"
          >
            {{ $t(linkTitle) }}
          </a>
        </span>
      </p>
    </div>
    <button :class="$style.notify__closeButton" @click="close">
      <base-icon name="circlecross" size="large" />
    </button>
  </div>
</template>

<script>
import { reduceText } from '@/utilities'

const LINK_REDUCE_LENGTH = 40

export default {
  props: {
    close: {
      type: Function,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    isModalExist: {
      type: Boolean,
      required: true,
    },
    checkIsModalExist: {
      type: Function,
      required: true,
    },
  },
  computed: {
    link() {
      return this.item.data?.link
    },
    linkTitle() {
      if (this.item.data?.linkTitle) {
        return this.item.data?.linkTitle
      }

      if (this.item.data?.link) {
        return reduceText(this.item.data?.link, LINK_REDUCE_LENGTH)
      }
      return null
    },
  },
  mounted() {
    this.checkIsModalExist()
  },
  beforeDestroy() {
    this.checkIsModalExist()
  },
  methods: {
    getText(text) {
      return reduceText(this.$t(text))
    },
  },
}
</script>

<style lang="scss">
.notifyLib {
  &_icon {
    flex-shrink: 0;
  }
}
span {
  .vue-notification-wrapper {
    &:first-child:not(:last-child) {
      .notifyLib {
        margin: 2rem 0 0;
      }
    }
  }
}
span {
  .vue-notification-wrapper {
    &:not(:first-child):not(:last-child) {
      .notifyLib {
        margin: 0;
        border-bottom: 0.1rem solid $color-dark;
        border-radius: 0;
        box-shadow: 0 0.1rem $color-dark-light;
      }
    }
    &:first-child:last-child {
      .notifyLib {
        margin: 1rem 0 0;
        border-radius: 0.6rem;
      }
    }
    &:first-child:not(:last-child) {
      .notifyLib {
        margin: 1rem 0 0;
        border-bottom: 0.1rem solid $color-dark;
        border-radius: 0.6rem 0.6rem 0 0;
        box-shadow: 0 0.1rem $color-dark-light;
      }
    }
    &:last-child {
      .notifyLib {
        margin: 0;
        border-radius: 0 0 0.6rem 0.6rem;
      }
    }
  }
}
</style>

<style lang="scss" module>
.notify,
.modalNotify {
  position: relative;
  padding: 2rem;
  margin: 1rem 0 0;
  display: flex;
  align-items: center;
  background-color: $color-black;
  border-radius: 0.6rem;

  &__content {
    margin: 0 2rem 0 1.5rem;
  }
  &__title {
    margin: 0;
    font-weight: $font-weight-bold;
    font-size: 1.8rem;
    line-height: 1.3;
    color: $color-white;
    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__smallTitle {
    font-size: 1.5rem;
  }

  &__text {
    margin: 0;
    font-weight: $font-weight-bold;
    font-size: 1.4rem;
    line-height: 1.3;
    color: $color-grey;
  }

  &__smallText {
    font-size: 1.2rem;
  }

  &__closeButton {
    position: absolute;
    top: 1.4rem;
    right: 1rem;
    color: $color-white;
    background-color: $color-transparent;
    border: none;
    cursor: pointer;
  }
}

.notify {
  margin: 1rem 0 0;
}

.link {
  margin: 0;
  &__text {
    font-size: 12px;
    white-space: nowrap;
    color: $color-link-hover;
  }
}

.success {
  color: $color-success;
}
.warning {
  color: $color-warning;
}
.error {
  color: $color-danger;
}
</style>
