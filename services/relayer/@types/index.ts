import { ChainId } from '@/types'

export type GetNovaStatusParams = {
  url: string
  ensName?: string
  chainId: ChainId
}

export type GetTornadoStatusParams = {
  url: string
  ensName?: string
  chainId?: ChainId
  hasEnabledLightProxy: boolean
}
