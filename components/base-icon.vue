<template>
  <span v-tooltip="tooltip" :class="[$style.icon, $style[size], { [$style.withTooltip]: tooltip }]">
    <component :is="iconComponent" role="img" />
  </span>
</template>

<script>
const iconsNames = [
  'Key',
  'Auth',
  'Fund',
  'Copy',
  'Info',
  'Tick',
  'Exit',
  'Plus',
  'Back',
  'Error',
  'Arrow',
  'Cross',
  'Stats',
  'Wallet',
  'Loader',
  'Trash',
  'Failed',
  'Medium',
  'Github',
  'Twitter',
  'Success',
  'Missing',
  'Warning',
  'Binance',
  'Tornado',
  'Withdraw',
  'Settings',
  'Metamask',
  'Telegram',
  'NotFound',
  'Discourse',
  'CircleCross',
  // currencies
  'BSC',
  'Nova',
  'Torn',
  'Gnosis',
  'Goerli',
  'Mainnet',
  'Polygon',
  'Optimism',
  'Arbitrum',
  'Avalanche',
  // Steps
  'Stake',
  'Relayer',
  'Workers',
  'Summary',
  'Subdomains',
  'Requirement',
]

const icons = iconsNames.reduce((acc, curr) => {
  acc[curr.toLowerCase()] = () => import(`./icons/${curr}.vue`)
  return acc
}, {})

export default {
  props: {
    name: {
      type: String,
      required: true,
      validator(value) {
        return Boolean(iconsNames.find((el) => el.toLowerCase() === value.toLowerCase()))
      },
    },
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'extraMedium', 'medium', 'small', 'large', 'xlarge', 'xl', 'fill', 'auto', 'symbol'].includes(value)
      },
    },
    tooltip: {
      type: String,
      required: false,
    },
  },
  computed: {
    iconComponent() {
      return icons[this.name]
    },
  },
}
</script>

<style lang="scss" module>
.icon {
  padding: 0;
  display: block;
  color: inherit;
  fill: currentColor;
  svg {
    display: block;
  }

  &:first-child:not(:last-child) {
    margin-right: 0.8rem;
  }
}

.withTooltip {
  cursor: help;
}

/* Sizes */
/* default, small, medium, extraMedium, large, xlarge, xl, fill, auto */
.default {
  width: 2.4rem;
  height: 2.4rem;
}
.small {
  width: 1.4rem;
  height: 1.4rem;
}
.medium {
  width: 1.6rem;
  height: 1.6rem;
}
.extraMedium {
  width: 2rem;
  height: 2rem;
}
.large {
  width: 3.2rem;
  height: 3.2rem;
}
.xlarge {
  width: 4.4rem;
  height: 4.4rem;
}
.xl {
  width: 6.4rem;
  height: 6.4rem;
}
.fill {
  width: inherit;
  height: inherit;
}
.auto {
  width: auto;
  height: 100%;
}
.symbol {
  width: 1.8rem;
  height: auto;
}
</style>
