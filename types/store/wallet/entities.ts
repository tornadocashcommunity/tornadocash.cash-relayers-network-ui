export type WalletAccount = {
  address: string
  balance: string
  tokenBalance: string
}

export type Provider = {
  name: string
  network: number
  isConnected: boolean
  mismatchNetwork: boolean
}

export type Loaders = {
  isConnecting: boolean
  isChainChanging: boolean
}
