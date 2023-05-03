import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { BigNumber } from 'ethers'

import { PendingTx, RootState, Transaction, TransactionMutation, TransactionState } from '@/types'

import { getProvider } from '@/services'
import { getEtherscanLink } from '@/utilities'
import { errors, numbers, txStatuses } from '@/constants'

export const actions: ActionTree<TransactionState, RootState> = {
  async transactionWatcher({ commit, dispatch }, { txHash, chainId, txType }) {
    try {
      const provider = getProvider(chainId)

      commit(TransactionMutation.SET_PENDING_TRANSACTION, { txHash, chainId, txType })

      const transaction = await provider.waitForTxReceipt({ txHash })

      dispatch('setTransaction', { ...transaction, chainId, timestamp: Date.now(), txType })
      const status = BigNumber.from(transaction.status)

      if (status.eq(txStatuses.FAIL)) {
        throw new Error(errors.wallet.FAILED_TX)
      }
    } catch (err) {
      commit(TransactionMutation.UPDATE_PENDING_TRANSACTION, txHash)
      throw new Error(err.message)
    }
  },

  checkPendingTx({ getters, commit, dispatch }) {
    const callback = async ({ transactionHash, chainId }: PendingTx) => {
      const provider = getProvider(chainId)

      const tx = await provider.waitForTxReceipt({ txHash: transactionHash })

      if (tx?.blockNumber != null) {
        dispatch('setTransaction', {
          ...tx,
          chainId,
          timestamp: Date.now(),
          status: txStatuses.SUCCESS,
        })
      } else {
        commit(TransactionMutation.UPDATE_PENDING_TRANSACTION, transactionHash)
      }
    }

    getters.pendingTxs.forEach((pendingTx: PendingTx) => {
      callback(pendingTx)
    })
  },

  setTransaction({ commit }, transaction) {
    try {
      commit(TransactionMutation.SET_TRANSACTION, transaction)
      commit(TransactionMutation.UPDATE_PENDING_TRANSACTION, transaction.transactionHash)

      const typesByTxStatus = {
        [txStatuses.FAIL]: 'error',
        [txStatuses.SUCCESS]: 'success',
        [txStatuses.PENDING]: 'warning',
      }

      const toastStatus = typesByTxStatus[BigNumber.from(transaction.status)._hex]

      if (!toastStatus || toastStatus === 'error') {
        return
      }

      const link = getEtherscanLink(transaction.chainId, transaction.transactionHash, 'transaction')

      this.$notification({
        type: transaction.type,
        duration: numbers.TOAST_DURATION,
        title: 'notifyTitles.transaction.title',
        data: { link, linkTitle: 'notifyTitles.transaction.link' },
      })
    } catch (err) {
      console.log('setTransaction has error:', err.message)
    }
  },
}

export const getters: GetterTree<TransactionState, RootState> = {
  txHash: (state: TransactionState) => {
    return state.txHash
  },
  pendingTxs: (state: TransactionState) => {
    return state.pendingTxs
  },
  isPendingTxs: (state: TransactionState) => {
    return Boolean(state.pendingTxs.length)
  },
  txsHistory: (state: TransactionState) => {
    const pendingTxs: Transaction[] = state.pendingTxs.map(({ transactionHash }) => ({
      transactionHash,
      status: txStatuses.PENDING,
    }))
    return Object.values(state.entities).reverse().concat(pendingTxs)
  },
  currentTransaction: (state: TransactionState) => (txHash: string) => {
    return state.entities[txHash]
  },
}

export const mutations: MutationTree<TransactionState> = {
  [TransactionMutation.SET_PENDING_TRANSACTION](state, payload) {
    const isExist = state.pendingTxs.find(({ transactionHash }) => transactionHash === payload.txHash)
    if (!isExist) {
      state.pendingTxs = [
        ...state.pendingTxs,
        { ...payload.transactionInfo, transactionHash: payload.txHash, chainId: payload.chainId, txType: payload.txType },
      ]
    }
  },
  [TransactionMutation.SET_TRANSACTION](state, payload) {
    // @ts-expect-error
    this._vm.$set(state.entities, payload.transactionHash, payload)
  },
  [TransactionMutation.UPDATE_TRANSACTION](state, payload) {
    // @ts-expect-error
    this._vm.$set(state.entities, payload.txHash, {
      ...state.entities[payload.txHash],
      ...payload,
    })
  },
  [TransactionMutation.UPDATE_PENDING_TRANSACTION](state, payload) {
    state.pendingTxs = state.pendingTxs.filter(({ transactionHash }) => transactionHash !== payload)

    if (!state.txHash.includes(payload)) {
      state.txHash = [...state.txHash, payload]
    }
  },
}

export const state = () => {
  return {
    txHash: [],
    entities: {},
    pendingTxs: [],
  }
}
