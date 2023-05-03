import { BigNumber } from 'ethers'

import { WalletInfo } from '@/types'

const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: () => window.ethereum,
    name: 'MetaMask',
    iconName: 'metamask',
    description: 'Easy-to-use browser extension.',
  },
}

const numbers = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  FOUR: 4,
  TEN: 10,
  THREE: 3,
  GWEI: 1e9,
  WEI: 1e18,
  PRECISION: 4,
  SECOND: 1000,
  THOUSAND: 1000,
  ONE_HUNDRED: 100,
  ONE_DAY: 86400000,
  ETH_DECIMALS: 18,
  USD_DECIMALS: 6,
  GWEI_DECIMALS: 9,
  DAI_DECIMALS: 8,
  ETHER_DECIMALS: 18,
  APP_STEPS_COUNT: 4,
  PAGINATION_STEP: 1,
  TOAST_DURATION: 6000,
  ENS_SUBDOMAINS_COUNT: 8,
  CHECK_INPUT_DEBOUNCE: 500,
  NOVA_ENS_SUBDOMAINS_COUNT: 1,
  FETCH_BALANCES_INTERVAL: 10000,
  CHECK_RELAYER_URL_DEBOUNCE: 500,
  CHECK_WORKER_INPUT_DEBOUNCE: 300,
  CHECK_STAKE_AMOUNT_DEBOUNCER: 300,
}

const MAX_REDUCE_LENGTH = 120

const BG_ZERO = BigNumber.from(numbers.ZERO)
const APPROVE_AMOUNT = BigNumber.from('2').pow('256').sub('1')

export { BG_ZERO, numbers, MAX_REDUCE_LENGTH, SUPPORTED_WALLETS, APPROVE_AMOUNT }
