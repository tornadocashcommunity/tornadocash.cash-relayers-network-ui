import { ChainId } from '@/types'

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://rpc.mevblocker.io',
}
