import { ChainId, NetworkConfig, MetamaskList } from '@/types'

const CHAINS: NetworkConfig = {
  [ChainId.MAINNET]: {
    symbol: 'ETH',
    name: 'ethereum',
    shortName: 'eth',
    icon: 'ethereum',
    network: 'Mainnet',
    deployBlock: 13494216,
    blockDuration: 15000,
    blockGasLimit: 144000000,
    hexChainId: '0x1',
    isEipSupported: true,
  },
}

const METAMASK_LIST: MetamaskList = {}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const txStatuses = {
  FAIL: '0x00',
  SUCCESS: '0x01',
  PENDING: '0x02',
}

export { CHAINS, ZERO_ADDRESS, txStatuses, METAMASK_LIST }
