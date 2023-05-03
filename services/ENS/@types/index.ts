import { ChainId } from '~/types'

export enum relayerStatus {
  MISSING = 'missing',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export type SubdomainInfo = {
  name: string
  icon: string
  title: string
  ensName?: string
  chainId?: ChainId
  status: relayerStatus
  hasEnabledLightProxy: boolean
}

export type GetSubdomainWithStatusParams = {
  ensName: string
  chainId: ChainId
  subdomain: SubdomainInfo
}

export type GetSubdomainStatusParams = {
  name: string
  ensName: string
  chainId: ChainId
  hasEnabledLightProxy: boolean
}
