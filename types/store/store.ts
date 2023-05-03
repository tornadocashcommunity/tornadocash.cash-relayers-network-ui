import { WalletState, ApplicationState, SetupState, GasPriceState } from '@/types'

export interface RootState {
  root: boolean
  version: string
  setup: SetupState
  wallet: WalletState
  gasPrice: GasPriceState
  application: ApplicationState
}
