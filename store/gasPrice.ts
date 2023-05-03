import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { BigNumber } from 'ethers'

import { ChainId, RootState } from '@/types'
import { numbers, CHAINS } from '@/constants'
import { getGasPrice, estimateFees } from '@/services'

import { GasPriceState, GasPriceMutation } from '@/types/store/gasPrice'

export const actions: ActionTree<GasPriceState, RootState> = {
  async estimateGasWatcher({ commit, dispatch, getters }) {
    const TIME_OUT = 15
    const { chainId } = getters.dependencies
    try {
      if (getters.isEipSupported) {
        const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFees(chainId)

        commit(GasPriceMutation.SET_GAS_PARAMS, { maxFeePerGas, maxPriorityFeePerGas, chainId })
      } else {
        const gasPrices = await getGasPrice(chainId)

        commit(GasPriceMutation.SET_GAS_PRICES, { ...gasPrices, chainId })
      }
    } catch (err) {
      console.log('estimateGasWatcher has error: ', err.message)
    } finally {
      setTimeout(() => {
        dispatch('estimateGasWatcher')
      }, TIME_OUT * numbers.SECOND)
    }
  },
}

export const mutations: MutationTree<GasPriceState> = {
  [GasPriceMutation.SET_GAS_PRICES](state, { chainId, ...rest }) {
    // @ts-expect-error
    this._vm.$set(state.prices, chainId, { ...state.prices[chainId], ...rest })
  },
  [GasPriceMutation.SET_GAS_PARAMS](state, { chainId, ...rest }) {
    // @ts-expect-error
    this._vm.$set(state.params, chainId, rest)
  },
}

export const getters: GetterTree<GasPriceState, RootState> = {
  isEipSupported: (state: GasPriceState, getters) => {
    const { chainId } = getters.dependencies

    return CHAINS[chainId].isEipSupported
  },
  currentGasPrice: (state: GasPriceState, getters) => {
    if (getters.isEipSupported) {
      return getters.gasParams.maxFeePerGas
    }
    return getters.currentGasPriceById
  },
  gasParams: (state: GasPriceState, getters) => {
    const { chainId } = getters.dependencies

    return state.params[chainId]
  },
  txGasParams: (_, getters) => {
    if (getters.isEipSupported) {
      return getters.gasParams
    }
    return { gasPrice: getters.currentGasPriceById }
  },

  // private
  currentGasPriceById: (state: GasPriceState, getters) => {
    const { chainId } = getters.dependencies

    const currentGas = state.prices[chainId]
    return BigNumber.from(currentGas[currentGas.selected])._hex
  },
  // another module dependencies
  dependencies: (state, getters, rootState, rootGetters) => {
    return {
      // wallet
      chainId: rootGetters['wallet/chainId'],
    }
  },
}

export const state = () => {
  return {
    params: {
      [ChainId.MAINNET]: {
        maxFeePerGas: '0x25FF7A6000',
        maxPriorityFeePerGas: '0x77359400',
      },
    },
    prices: {
      [ChainId.MAINNET]: {
        low: 10,
        fast: 50,
        instant: 80,
        standard: 30,
        selected: 'fast',
      },
    },
  }
}
