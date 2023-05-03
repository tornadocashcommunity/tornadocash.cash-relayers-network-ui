import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { BigNumber, ethers } from 'ethers'

import { relayerStatus } from '@/services/ENS/@types'
import { SetupMutation, SetupState } from '@/types/store/setup'
import { ChainId, RegisterParams, RegisterPermitParams, RootState } from '@/types'

import { errors, numbers } from '@/constants'
import { getRelayerRegistry } from '@/contracts'
import { ensService, tornadoRelayerService } from '@/services'
import { fromWei, toWei, toDecimalsPlaces, toHttps, validation, toChecksumAddress } from '@/utilities'

export const actions: ActionTree<SetupState, RootState> = {
  async getPermitSign({ getters, commit, dispatch }) {
    try {
      const { tornStake, stakeInWei } = getters
      const { signature, deadline } = await dispatch('wallet/getStakePermit', tornStake, { root: true })

      commit(SetupMutation.SET_PERMIT_AMOUNT, stakeInWei.toString())
      commit(SetupMutation.SET_SIGNATURE, { ...signature, deadline })
    } catch (err) {
      throw new Error(`Create permit sign error: ${err.message}`)
    }
  },

  async getMinStake({ getters, commit }) {
    try {
      const { chainId } = getters.dependencies

      const registryContract = getRelayerRegistry(chainId)
      const minStakeAmount = await registryContract.callStatic.minStakeAmount()

      commit(SetupMutation.SET_MIN_STAKE, BigNumber.from(minStakeAmount)._hex)
    } catch (err) {
      console.warn('getMinStake has error:', err.message)
    }
  },

  async checkAllowance({ dispatch, commit }, txHash) {
    try {
      const approveAmount = await dispatch('wallet/checkAllowance', txHash, { root: true })
      commit(SetupMutation.SET_APPROVE_AMOUNT, BigNumber.from(approveAmount)._hex)
    } catch (err) {
      throw new Error(`checkAllowance error: ${err.message}`)
    }
  },

  async setApprove({ dispatch }) {
    try {
      const txHash = await dispatch('wallet/setApprove', null, { root: true })
      await dispatch('checkAllowance', txHash)

      return txHash
    } catch (err) {
      throw new Error(`Set approve error: ${err.message}`)
    }
  },

  async register({ getters, commit, dispatch }) {
    try {
      const { isPermitted, isApproved } = getters

      if (isPermitted) {
        await dispatch('registerPermit')
        return
      }

      const approveAmount = await dispatch('wallet/checkAllowance', null, { root: true })
      commit(SetupMutation.SET_APPROVE_AMOUNT, BigNumber.from(approveAmount)._hex)

      if (isApproved) {
        await dispatch('registerApprove')
        return
      }

      throw new Error(errors.validation.INSUFFICIENT_DATA)
    } catch (err) {
      const errorMessage = await dispatch(
        'application/errorHandler',
        { errorMessage: err.message, title: 'notifyTitles.register' },
        { root: true },
      )
      throw new Error(errorMessage)
    }
  },

  async registerPermit({ getters, dispatch }) {
    try {
      const { walletAddress, chainId } = getters.dependencies
      const { ensName, tornStake, signature, validWorkers, permitAmount, stakeInWei } = getters

      if (!BigNumber.from(permitAmount).eq(stakeInWei)) {
        throw new Error(errors.validation.INSUFFICIENT_PERMIT_AMOUNT)
      }

      const registryContract = getRelayerRegistry(chainId)

      const { deadline, v, r, s } = signature

      const params: RegisterPermitParams = [ensName, tornStake, validWorkers, walletAddress, deadline, v, r, s]

      const registerCalldata = registryContract.interface.encodeFunctionData('registerPermit', params)
      const gas = await registryContract.estimateGas.registerPermit(...params, { from: walletAddress })

      const txHash = await dispatch(
        'wallet/createWalletTransaction',
        {
          gas: gas._hex,
          txType: 'permit register',
          data: registerCalldata,
          to: registryContract.address,
        },
        { root: true },
      )

      return txHash
    } catch (err) {
      throw new Error(`Permit registry error: ${err.message}`)
    }
  },

  async registerApprove({ getters, dispatch }) {
    try {
      const { ensName, validWorkers, tornStake, approveAmount, stakeInWei } = getters
      const { walletAddress, chainId } = getters.dependencies

      if (BigNumber.from(approveAmount).lt(stakeInWei)) {
        throw new Error(errors.validation.INSUFFICIENT_APPROVE_AMOUNT)
      }
      const registryContract = getRelayerRegistry(chainId)

      const params: RegisterParams = [ensName, tornStake, validWorkers]

      const registerCalldata = registryContract.interface.encodeFunctionData('register', params)
      const gas = await registryContract.estimateGas.register(...params, { from: walletAddress })

      const txHash = await dispatch(
        'wallet/createWalletTransaction',
        {
          gas: gas._hex,
          txType: 'register',
          data: registerCalldata,
          to: registryContract.address,
        },
        { root: true },
      )

      return txHash
    } catch (err) {
      throw new Error(`Registry error: ${err.message}`)
    }
  },
  async checkRelayer({ getters }) {
    try {
      if (!getters.relayerUrl) {
        return
      }
      if (!validation.externalLink(getters.relayerUrl)) {
        throw new Error(errors.validation.INVALID_RELAYER_URL)
      }

      const { isValid, chainId, address } = await tornadoRelayerService.getRelayerData({
        url: getters.relayerUrl,
        hasEnabledLightProxy: false,
      })

      if (!isValid) {
        throw new Error(errors.validation.INVALID_RELAYER)
      }

      if (address !== getters.dependencies.walletAddress) {
        throw new Error(errors.validation.DIFFERENT_REWARD_ADDRESS)
      }

      if (chainId !== ChainId.MAINNET) {
        throw new Error(errors.validation.WRONG_NETWORK)
      }
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async checkEns({ getters, commit }) {
    try {
      const { walletAddress, chainId } = getters.dependencies
      if (!getters.ensName) {
        return
      }

      if (!validation.ens(getters.ensName)) {
        throw new Error(errors.validation.INVALID_ENS)
      }

      if (!validation.domain(getters.ensName)) {
        throw new Error(errors.validation.INVALID_ENS_DOMAIN)
      }

      const owner = await ensService.getEnsOwner(getters.ensName, chainId)

      if (!owner) {
        throw new Error(errors.validation.NOT_FOUND_ENS)
      }

      if (owner !== walletAddress) {
        throw new Error(errors.validation.ENS_NOT_A_OWNER)
      }

      const subdomainEnsName = `${ensService.subdomains.mainnet.name}.${getters.ensName}`
      const relayerData = await tornadoRelayerService.getRelayerDataFromENS(subdomainEnsName, chainId)

      if (relayerData) {
        await tornadoRelayerService.checkProtocol(relayerData.txt)

        if (getters.relayerUrl !== toHttps(relayerData.url)) {
          throw new Error(errors.validation.ENS_MAINNET_URL)
        }
      } else {
        throw new Error(errors.relayer.EMPTY_MAINNET)
      }

      const subdomains = await ensService.checkSubdomains(getters.ensName, chainId)

      const mainnetSubdomain = subdomains.find((subdomain) => subdomain.chainId === ChainId.MAINNET)
      const isMainnetSubdomain = subdomains.length && mainnetSubdomain?.status === relayerStatus.SUCCESS

      if (!isMainnetSubdomain) {
        throw new Error(errors.relayer.FAILED_MAINNET_STATUS)
      }
      commit(SetupMutation.SET_ENS_SUBDOMAINS, subdomains)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  checkStake({ getters, state }) {
    if (!getters.stakeInWei) {
      return
    }

    if (BigNumber.from(state.settings.minStake).gt(getters.stakeInWei)) {
      throw new Error(errors.validation.AMOUNT_LT_MIN_STAKE)
    }

    if (BigNumber.from(getters.stakeInWei).gt(toWei(getters.dependencies.tokenBalance))) {
      throw new Error(errors.validation.AMOUNT_GT_TORN_BALANCE)
    }
  },
}

export const getters: GetterTree<SetupState, RootState> = {
  subdomains(state: SetupState) {
    return state.subdomains
  },
  successSubdomains(state: SetupState) {
    return state.subdomains.filter((subdomain) => subdomain.status === relayerStatus.SUCCESS)
  },
  relayerUrl(state: SetupState) {
    return state.url
  },
  ensName(state: SetupState) {
    return state.ens
  },
  workers(state: SetupState, getters) {
    return [getters.dependencies.walletAddress, ...state.workers]
  },
  stake(state: SetupState) {
    return state.stakeAmount
  },
  stakeInWei(state: SetupState) {
    if (!state.stakeAmount) {
      return '0'
    }
    return toWei(state.stakeAmount)
  },
  signature(state: SetupState) {
    return state.signature
  },
  permitAmount(state: SetupState) {
    return state.settings.permitAmount
  },
  approveAmount(state: SetupState) {
    return state.settings.approveAmount
  },
  isPermitted(state: SetupState, getters) {
    if (!getters.stakeInWei) {
      return false
    }

    const { permitAmount } = state.settings

    return Boolean(permitAmount) && BigNumber.from(permitAmount).eq(getters.stakeInWei)
  },
  isApproved(state: SetupState, getters) {
    if (!getters.stakeInWei) {
      return false
    }

    const { approveAmount } = state.settings

    return Boolean(approveAmount) && BigNumber.from(approveAmount).gte(getters.stakeInWei)
  },
  isSigned(state: SetupState, getters) {
    const { isPermitted, isApproved } = getters
    return isPermitted || isApproved
  },
  isPermitChanged(state: SetupState, getters) {
    if (!state.stakeAmount) {
      return true
    }
    return !BigNumber.from(state.settings.permitAmount).eq(getters.stakeInWei)
  },
  isEnoughApprove(state: SetupState, getters) {
    if (!state.stakeAmount) {
      return false
    }
    return BigNumber.from(state.settings.approveAmount).gte(getters.stakeInWei)
  },
  tornStake(state: SetupState) {
    return ethers.utils.parseEther(String(state.stakeAmount)).toHexString()
  },
  minStake(state: SetupState) {
    if (!state.settings.minStake) {
      return ''
    }
    return toDecimalsPlaces(fromWei(state.settings.minStake), numbers.PRECISION)
  },
  validWorkers(state: SetupState, getters) {
    return state.workers.filter((worker: string) => worker !== getters.dependencies.walletAddress && worker)
  },
  // another module dependencies
  dependencies: (state, getters, rootState, rootGetters) => {
    return {
      // gasPrice
      txGasParams: rootGetters['gasPrice/txGasParams'],
      // wallet
      chainId: rootGetters['wallet/chainId'],
      nameProvider: rootGetters['wallet/nameProvider'],
      tokenBalance: rootGetters['wallet/tokenBalance'],
      walletAddress: rootGetters['wallet/walletAddress'],
    }
  },
}

export const mutations: MutationTree<SetupState> = {
  [SetupMutation.SET_STAKE_AMOUNT](state, payload) {
    state.stakeAmount = payload
  },
  [SetupMutation.SET_RELAYER_URL](state, payload) {
    state.url = payload
  },
  [SetupMutation.SET_ENS_NAME](state, payload) {
    state.ens = payload
  },
  [SetupMutation.SET_SIGNATURE](state, payload) {
    state.signature = payload
  },
  [SetupMutation.ADD_WORKER](state, payload) {
    state.workers = state.workers.concat(toChecksumAddress(payload))
  },
  [SetupMutation.SET_PERMIT_AMOUNT](state, payload) {
    state.settings.permitAmount = payload
  },
  [SetupMutation.SET_APPROVE_AMOUNT](state, payload) {
    state.settings.approveAmount = payload
  },
  [SetupMutation.SET_MIN_STAKE](state, payload) {
    state.settings.minStake = payload
  },
  [SetupMutation.SET_ENS_SUBDOMAINS](state, payload) {
    state.subdomains = payload
  },
  [SetupMutation.REMOVE_WORKER](state, payload) {
    state.workers = state.workers.filter((_, index) => index !== payload)
  },
  [SetupMutation.CLEAR_STATE](state) {
    state.url = ''
    state.ens = ''
    state.workers = []
    state.stakeAmount = '0'
    state.settings = {
      minStake: '0',
      permitAmount: '0',
      approveAmount: '0',
    }
    state.subdomains = []
    state.signature = {
      v: '',
      r: '',
      s: '',
      deadline: 0,
    }
  },
}

export const state = (): SetupState => {
  return {
    url: '',
    ens: '',
    workers: [],
    stakeAmount: '0',
    subdomains: [],
    settings: {
      minStake: '0',
      permitAmount: '0',
      approveAmount: '0',
    },
    signature: {
      v: '',
      r: '',
      s: '',
      deadline: 0,
    },
  }
}

export const namespaced = true
