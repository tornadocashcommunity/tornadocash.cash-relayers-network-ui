import { ENSSubdomains } from '@/types'

export type SetupState = {
  url: string
  ens: string
  workers: string[]
  stakeAmount: string
  subdomains: ENSSubdomains
  settings: {
    minStake: string
    permitAmount: string
    approveAmount: string
  }
  signature: {
    v: string
    r: string
    s: string
    deadline: number
  }
}
