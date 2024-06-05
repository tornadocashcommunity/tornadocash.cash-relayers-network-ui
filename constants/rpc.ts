import { ChainId } from '@/types'

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://tornadocash-rpc.com',
}
