import { ChainId } from '~/types'

export type Transaction = {
  type?: string
  status: string
  chainId?: ChainId
  timestamp?: number
  blockNumber?: number
  transactionHash: string
}

export type PendingTransaction = Omit<Transaction, 'timestamp' | 'blockNumber' | 'amount' | 'confirmations'>

export type PendingTx = {
  transactionHash: string
  chainId: ChainId
}

export type PendingTxs = PendingTx[]

export type Transactions = {
  txHash: string[]
  pendingTxs: PendingTxs
  entities: { [key in string]: Transaction }
}
