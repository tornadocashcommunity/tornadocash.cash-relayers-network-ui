import { ChainId } from '@/types'

export const REGISTRY_CONTRACT: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
}

export const TORN_TOKEN: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x77777feddddffc19ff86db637967013e6c6a116c',
}

export const DEPLOYED_BLOCK = 14173129
