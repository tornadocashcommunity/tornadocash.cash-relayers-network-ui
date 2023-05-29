import { ChainId } from '@/types'

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607',
}
