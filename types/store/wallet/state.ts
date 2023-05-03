import { Provider, WalletAccount, Loaders } from './entities'

export type WalletState = {
  loaders: Loaders
  provider: Provider
  account: WalletAccount
}
