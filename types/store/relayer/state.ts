import { ENSSubdomains } from '@/types'

export type RelayerState = {
  url: string
  ens: string
  balance: string
  workers: string[]
  isRegistered: boolean
  subdomains: ENSSubdomains
}
