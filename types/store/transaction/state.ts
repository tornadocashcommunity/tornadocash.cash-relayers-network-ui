import { PendingTxs, Transaction } from './entities'

export type TransactionState = {
  txHash: string[]
  pendingTxs: PendingTxs
  entities: { [key in string]: Transaction }
}
