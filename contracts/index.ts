import { ChainId } from '@/types'
import { getProvider } from '@/services'

import { REGISTRY_CONTRACT, TORN_TOKEN } from '@/constants'
import {
  Torn__factory as TornFactory,
  EnsRegistry__factory as EnsRegistryFactory,
  RelayerRegistry__factory as RelayerRegistryFactory,
} from '../_contracts'

export function getTorn(chainId: ChainId) {
  const { provider } = getProvider(chainId)
  return TornFactory.connect(TORN_TOKEN[chainId], provider)
}

export function getRelayerRegistry(chainId: ChainId) {
  const { provider } = getProvider(chainId)
  return RelayerRegistryFactory.connect(REGISTRY_CONTRACT[chainId], provider)
}

export function getEnsRegistry(chainId: ChainId) {
  const { provider } = getProvider(chainId)
  const ensRegistryContract = provider.network.ensAddress

  return EnsRegistryFactory.connect(ensRegistryContract!, provider)
}
