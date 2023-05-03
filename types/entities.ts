import { ChainId } from '@/types'
import { relayerStatus } from '@/services/ENS/@types'

export type Relayer = {
  name: string
  ensName: string
  url: string
  chainId: number
  netId?: number
  version: string
  rewardAddress: string
  rewardAccount?: string
  type: string
  health: {
    status: boolean
    error: string
  }
  serviceFee: {
    transfer: string
    withdrawal: number
  }
}

export type ModalProps = {
  name?: string
  resizable?: boolean
  adaptive?: boolean
  draggable?: boolean | string
  scrollable?: boolean
  focusTrap?: boolean
  reset?: boolean
  clickToClose?: boolean
  transition?: string
  overlayTransition?: string
  classes?: string | string[]
  styles?: string | string[]
  width?: string | number
  height?: string | number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  shiftX?: number
  shiftY?: number
}

export type ENSSubdomain = {
  hasEnabledLightProxy: boolean
  name: string
  icon: string
  title: string
  chainId: ChainId
  status: relayerStatus
}

export type ENSSubdomains = ENSSubdomain[]
