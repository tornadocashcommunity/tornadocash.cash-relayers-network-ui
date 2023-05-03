const MAINNET_CHAIN_ID = 1
const BSC_CHAIN_ID = 56
const GNOSIS_CHAIN_ID = 100
const POLYGON_CHAIN_ID = 137
const AVALANCHE_CHAIN_ID = 43114
const OPTIMISM_CHAIN_ID = 10
const ARBITRUM_CHAIN_ID = 42161
const GOERLI_CHAIN_ID = 5

export enum ChainId {
  MAINNET = MAINNET_CHAIN_ID,
  BSC = BSC_CHAIN_ID,
  GNOSIS = GNOSIS_CHAIN_ID,
  POLYGON = POLYGON_CHAIN_ID,
  AVALANCHE = AVALANCHE_CHAIN_ID,
  OPTIMISM = OPTIMISM_CHAIN_ID,
  ARBITRUM = ARBITRUM_CHAIN_ID,
  GOERLI = GOERLI_CHAIN_ID,
}

export interface WalletInfo {
  // eslint-disable-next-line
  connector?: any
  name: string
  iconName: string
  description: string
}

export type NetworkConfigItem = {
  symbol: string
  name: string
  icon: string
  shortName: string
  network: string
  deployBlock: number
  blockDuration: number
  blockGasLimit: number
  hexChainId: string
  isEipSupported: boolean
}

export type MetamaskConfigItem = {
  chainId: string
  chainName: string
  rpcUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
}

export type NetworkConfig = {
  [key in number]: NetworkConfigItem
}

export type MetamaskList = {
  [key in number]: MetamaskConfigItem
}

export type Plugin<P> = (options: string | P) => void
export type Inject<T> = (name: string, plugin: Plugin<T> | T) => void

export * from './store'
export * from './entities'
