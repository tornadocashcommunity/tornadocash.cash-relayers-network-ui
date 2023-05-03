import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { relayerStatus } from '@/services/ENS/@types'
import { AddStakeParams, AddStakePermitParams, ChainId, RootState } from '@/types'
import { RelayerMutation, RelayerState } from '@/types/store/relayer'

import { getRelayerRegistry } from '@/contracts'
import { DEPLOYED_BLOCK, errors, numbers } from '@/constants'
import { ensService, tornadoRelayerService } from '@/services'
import { errorParser, fromWei, toDecimalsPlaces } from '@/utilities'

export const actions: ActionTree<RelayerState, RootState> = {
  async checkIsRelayerRegistered({ getters, commit }) {
    try {
      const { walletAddress, chainId } = getters.dependencies

      const registryContract = getRelayerRegistry(chainId)
      const isRegistered = await registryContract.callStatic.isRelayerRegistered(walletAddress, walletAddress)

      commit(RelayerMutation.SET_REGISTERED, isRegistered)
      return isRegistered
    } catch (err) {
      throw new Error(`checkIsRelayerRegistered has error: ${err.message}`)
    }
  },

  async geRelayerWorkers({ getters, commit }) {
    try {
      const { walletAddress, chainId } = getters.dependencies

      const registryContract = getRelayerRegistry(chainId)

      const filterRegisteredWorkers = registryContract.filters.WorkerRegistered()
      const registeredWorkers = await registryContract.queryFilter(filterRegisteredWorkers, DEPLOYED_BLOCK)

      const registeredOwnWorkers: string[] = registeredWorkers.reduce((acc: string[], curr) => {
        if (curr.args.includes(walletAddress)) {
          const workers = curr.args.filter((address) => address !== walletAddress)
          acc = acc.concat(workers)
        }
        return acc
      }, [])

      if (!registeredOwnWorkers.includes(walletAddress)) {
        registeredOwnWorkers.unshift(walletAddress)
      }

      commit(RelayerMutation.SET_WORKERS, registeredOwnWorkers)
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async getRelayerENSData({ getters, commit, dispatch }, ensHash) {
    try {
      const { chainId } = getters.dependencies

      const ensName = await ensService.getNameFromHash(ensHash)
      const subdomains = await ensService.checkSubdomains(ensName, chainId)

      const mainnetSubdomain = subdomains.find((el) => el.chainId === ChainId.MAINNET)

      if (!mainnetSubdomain) {
        throw new Error(errors.relayer.EMPTY_MAINNET)
      }
      // @ts-expect-error
      const { url } = await tornadoRelayerService.getRelayerDataFromENS(mainnetSubdomain.ensName, chainId)

      commit(RelayerMutation.SET_URL, url)
      commit(RelayerMutation.SET_ENS, ensName)
      commit(RelayerMutation.SET_SUBDOMAINS, subdomains)
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async getRelayers({ getters, commit }) {
    try {
      const { walletAddress, chainId } = getters.dependencies

      const registryContract = getRelayerRegistry(chainId)

      const { balance, ensHash } = await registryContract.callStatic.relayers(walletAddress)

      commit(RelayerMutation.SET_BALANCE, balance)

      return ensHash
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async getRelayerData({ dispatch }) {
    try {
      const isRegistered = await dispatch('checkIsRelayerRegistered')

      if (!isRegistered) {
        throw new Error(errors.relayer.NOT_REGISTERED)
      }

      await dispatch('geRelayerWorkers')
      const ensHash = await dispatch('getRelayers')
      await dispatch('getRelayerENSData', ensHash)
    } catch (err) {
      const errorText = errorParser(err.message, errors.validation.NO_RESPONSE)

      throw new Error(errorText)
    }
  },

  async addStake({ getters, dispatch }, { amount }) {
    try {
      const { walletAddress, chainId } = getters.dependencies

      const registryContract = getRelayerRegistry(chainId)
      const params: AddStakeParams = [walletAddress, amount]

      const calldata = await registryContract.interface.encodeFunctionData('stakeToRelayer', params)
      const gas = await registryContract.estimateGas.stakeToRelayer(...params, { from: walletAddress })

      const txHash = await dispatch(
        'wallet/createWalletTransaction',
        {
          gas: gas._hex,
          data: calldata,
          txType: 'add stake',
          to: registryContract.address,
        },
        { root: true },
      )
      return txHash
    } catch (err) {
      console.warn(err.message)
      const errorText = errorParser(err.message)

      throw new Error(errorText)
    }
  },

  async addStakePermit({ getters, dispatch }, { amount, signature, deadline }) {
    try {
      const { walletAddress, chainId } = getters.dependencies
      const { v, r, s } = signature

      const registryContract = getRelayerRegistry(chainId)
      const params: AddStakePermitParams = [walletAddress, amount, walletAddress, deadline, v, r, s]

      const calldata = await registryContract.interface.encodeFunctionData('stakeToRelayerPermit', params)
      const gas = await registryContract.estimateGas.stakeToRelayerPermit(...params, { from: walletAddress })

      const txHash = await dispatch(
        'wallet/createWalletTransaction',
        {
          gas: gas._hex,
          data: calldata,
          txType: 'permit stake',
          to: registryContract.address,
        },
        { root: true },
      )
      return txHash
    } catch (err) {
      console.log(err.message)
      const errorText = errorParser(err.message)

      throw new Error(errorText)
    }
  },
}

export const getters: GetterTree<RelayerState, RootState> = {
  relayerUrl(state: RelayerState) {
    return state.url
  },
  relayerENS(state: RelayerState) {
    return state.ens
  },
  relayerBalance(state: RelayerState) {
    if (!state.balance) {
      return '0'
    }
    return toDecimalsPlaces(fromWei(state.balance), numbers.PRECISION)
  },
  relayerWorkers(state: RelayerState) {
    return state.workers
  },
  subdomains(state: RelayerState) {
    return state.subdomains
  },
  successSubdomains(state: RelayerState) {
    return state.subdomains.filter((subdomain) => subdomain.status === relayerStatus.SUCCESS)
  },
  isRelayerRegistered(state: RelayerState) {
    return state.isRegistered
  },
  // another module dependencies
  dependencies: (state, getters, rootState, rootGetters) => {
    return {
      // wallet
      chainId: rootGetters['wallet/chainId'],
      walletAddress: rootGetters['wallet/walletAddress'],
    }
  },
}

export const mutations: MutationTree<RelayerState> = {
  [RelayerMutation.SET_BALANCE](state, payload) {
    state.balance = payload
  },
  [RelayerMutation.SET_URL](state, payload) {
    state.url = payload
  },
  [RelayerMutation.SET_ENS](state, payload) {
    state.ens = payload
  },
  [RelayerMutation.SET_WORKERS](state, payload) {
    state.workers = payload
  },
  [RelayerMutation.SET_SUBDOMAINS](state, payload) {
    state.subdomains = payload
  },
  [RelayerMutation.SET_REGISTERED](state, payload) {
    state.isRegistered = payload
  },
  [RelayerMutation.CLEAR_RELAYER_STATE](state) {
    state.url = ''
    state.ens = ''
    state.balance = '0'
    state.workers = []
    state.subdomains = []
    state.isRegistered = false
  },
}

export const state = (): RelayerState => {
  return {
    url: '',
    ens: '',
    balance: '0',
    workers: [],
    subdomains: [],
    isRegistered: false,
  }
}

export const namespaced = true
