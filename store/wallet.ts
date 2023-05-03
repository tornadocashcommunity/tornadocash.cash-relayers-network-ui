import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { ApproveParams, ChainId, RootState } from '@/types'
import { WalletMutation, WalletState } from '@/types/store/wallet'

import { getRelayerRegistry, getTorn } from '@/contracts'
import { getProvider, getWalletProvider, onPermit } from '@/services'
import { CHAINS, errors, METAMASK_LIST, numbers, APPROVE_AMOUNT } from '@/constants'
import { fromWei, hexToNumber, numberToHex, toChecksumAddress, toDecimalsPlaces } from '@/utilities'

export const actions: ActionTree<WalletState, RootState> = {
  setProvider({ commit, dispatch }, params) {
    try {
      if (ChainId.MAINNET !== Number(params.network)) {
        commit(WalletMutation.MISMATCH_NETWORK, true)
        throw new Error('errors.wallet.mismatchNetwork')
      }

      commit(WalletMutation.MISMATCH_NETWORK, false)
      commit(WalletMutation.SET_PROVIDER, params)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async checkNetwork({ commit, getters }) {
    const provider = getWalletProvider(getters.nameProvider)
    const network = await provider.checkNetworkVersion()

    commit(WalletMutation.MISMATCH_NETWORK, network !== getters.chainId)
  },

  async getBalances({ dispatch }) {
    try {
      await dispatch('getTokenBalance')
      await dispatch('getWalletBalance')
    } finally {
      setTimeout(() => {
        dispatch('getBalances')
      }, numbers.FETCH_BALANCES_INTERVAL)
    }
  },

  async getTokenBalance({ getters, commit }) {
    try {
      const { chainId, walletAddress } = getters

      if (!walletAddress) {
        return
      }

      const tornContract = getTorn(chainId)

      const balance = await tornContract.callStatic.balanceOf(walletAddress)
      commit(WalletMutation.SET_TOKEN_BALANCE, balance.toString())
    } catch (err) {
      console.log('getWalletBalance has error:', err.message)
    }
  },

  async getWalletBalance({ commit, getters }) {
    try {
      const { chainId, walletAddress } = getters

      if (!walletAddress) {
        return
      }

      const { provider } = getProvider(chainId)

      const balance = await provider.getBalance(walletAddress)
      commit(WalletMutation.SET_WALLET_BALANCE, balance.toString())
    } catch (err) {
      console.log('getWalletBalance has error:', err.message)
    }
  },

  setWalletParams({ commit, dispatch }, address) {
    try {
      commit(WalletMutation.SET_WALLET_ADDRESS, address)
      dispatch('getBalances')
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async createWalletTransaction({ getters, dispatch }, { to, data, gas, txType, value = '0x0' }) {
    try {
      const { txGasParams } = getters.dependencies
      const { nameProvider, walletAddress, chainId } = getters

      const provider = getWalletProvider(nameProvider)

      const txHash = await provider.sendRequest<string>({
        method: 'eth_sendTransaction',
        params: [{ to, gas, data, value, from: walletAddress, ...txGasParams }],
      })

      await dispatch('transaction/transactionWatcher', { txHash, chainId, txType }, { root: true })

      return txHash
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async changeChain({ getters, dispatch, commit }, chainId) {
    const provider = getWalletProvider(getters.nameProvider)
    try {
      commit(WalletMutation.SET_LOADER_CHAIN_CHANGING, true)
      await provider.sendRequest({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAINS[chainId].hexChainId }],
      })
      await dispatch('checkNetwork')
    } catch (error) {
      const parsedError = await dispatch(
        'application/errorHandler',
        { errorMessage: error.message, title: 'notifyTitles.wallet' },
        { root: true },
      )

      if (parsedError === errors.wallet.TRY_ADDING_THE_CHAIN) {
        await provider.sendRequest({
          method: 'wallet_addEthereumChain',
          params: [METAMASK_LIST[chainId]],
        })
      }
    } finally {
      commit(WalletMutation.SET_LOADER_CHAIN_CHANGING, false)
    }
  },

  async getStakePermit({ getters }, tornStake) {
    try {
      const { walletAddress, nameProvider, chainId } = getters

      const tornContract = getTorn(chainId)
      const registryContract = getRelayerRegistry(chainId)

      const nonce = await tornContract.callStatic.nonces(walletAddress)

      const deadline = Math.trunc(new Date().getTime() / numbers.SECOND) + numbers.ONE_DAY

      const signature = await onPermit({
        deadline,
        nameProvider,
        value: tornStake,
        owner: walletAddress,
        token: tornContract.address,
        nonce: hexToNumber(nonce._hex),
        spender: registryContract.address,
      })

      return { signature, deadline }
    } catch (err) {
      throw new Error(`Create permit sign error: ${err.message}`)
    }
  },

  // ToDo save tx hash, show loader for user, keep out user without inned allowance
  async checkAllowance({ getters, commit }, txHash) {
    try {
      const { walletAddress, chainId, nameProvider } = getters
      if (!walletAddress) {
        return
      }
      const provider = getWalletProvider(nameProvider)

      if (txHash) {
        await provider.waitForTxReceipt({ txHash })
      }

      const tornContract = getTorn(chainId)
      const registryContract = getRelayerRegistry(chainId)
      const approveAmount = await tornContract.callStatic.allowance(walletAddress, registryContract.address)

      return approveAmount
    } catch (err) {
      throw new Error(err.message)
    }
  },

  async setApprove({ getters, dispatch }) {
    try {
      const { walletAddress, chainId } = getters

      const tornContract = getTorn(chainId)
      const registryContract = getRelayerRegistry(chainId)

      const unlimitedApprove = numberToHex(APPROVE_AMOUNT)
      const params: ApproveParams = [registryContract.address, unlimitedApprove]

      const approveCalldata = tornContract.interface.encodeFunctionData('approve', params)
      const gas = await tornContract.estimateGas.approve(...params, { from: walletAddress })

      const txHash = await dispatch(
        'wallet/createWalletTransaction',
        {
          gas: gas._hex,
          txType: 'approve',
          data: approveCalldata,
          to: tornContract.address,
        },
        { root: true },
      )

      return txHash
    } catch (err) {
      throw new Error(`Set approve error: ${err.message}`)
    }
  },
}

export const getters: GetterTree<WalletState, RootState> = {
  mismatchNetwork: (state: WalletState) => {
    return state.provider.mismatchNetwork
  },
  nameProvider: (state: WalletState) => {
    return state.provider.name
  },
  isConnected: (state: WalletState) => {
    return state.provider.isConnected
  },
  chainId: (state: WalletState) => {
    return Number(state.provider.network)
  },
  chainConfig: (state: WalletState) => {
    return CHAINS[state.provider.network]
  },
  walletAddress: (state: WalletState) => {
    return toChecksumAddress(state.account.address)
  },
  formattedWalletBalance: (state: WalletState) => {
    if (!state.account.balance) {
      return '0'
    }
    return toDecimalsPlaces(fromWei(state.account.balance), numbers.PRECISION)
  },
  walletBalance: (state: WalletState) => {
    return state.account.balance
  },
  tokenBalance: (state: WalletState) => {
    if (!state.account.tokenBalance) {
      return '0'
    }
    return fromWei(state.account.tokenBalance)
  },
  formattedTokenBalance: (state: WalletState, getters) => {
    return toDecimalsPlaces(getters.tokenBalance)
  },
  isConnecting(state: WalletState) {
    return state.loaders.isConnecting
  },
  isChainChanging(state: WalletState) {
    return state.loaders.isChainChanging
  },
  // another module dependencies
  dependencies: (state, getters, rootState, rootGetters) => {
    return {
      // gasPrice
      txGasParams: rootGetters['gasPrice/txGasParams'],
    }
  },
}

export const mutations: MutationTree<WalletState> = {
  [WalletMutation.SET_WALLET_ADDRESS](state, payload) {
    state.account.address = toChecksumAddress(payload)
  },
  [WalletMutation.SET_TOKEN_BALANCE](state, payload) {
    state.account.tokenBalance = payload
  },
  [WalletMutation.SET_WALLET_BALANCE](state, payload) {
    state.account.balance = payload
  },
  [WalletMutation.MISMATCH_NETWORK](state, payload) {
    state.provider.mismatchNetwork = payload
  },
  [WalletMutation.SET_PROVIDER](state, { network, name }) {
    state.provider = {
      ...state.provider,
      name,
      network,
      mismatchNetwork: false,
    }
  },
  [WalletMutation.SET_PROVIDER_CONNECTION](state, payload) {
    // @ts-expect-error
    this._vm.$set(state.provider, 'isConnected', payload)
  },
  [WalletMutation.SET_LOADER_CONNECTION](state, payload) {
    // @ts-expect-error
    this._vm.$set(state.loaders, 'isConnecting', payload)
  },
  [WalletMutation.SET_LOADER_CHAIN_CHANGING](state, payload) {
    // @ts-expect-error
    this._vm.$set(state.loaders, 'isChainChanging', payload)
  },
  [WalletMutation.CLEAR_LOADERS](state) {
    state.loaders = {
      isConnecting: false,
      isChainChanging: false,
    }
  },
  [WalletMutation.CLEAR_PROVIDER](state) {
    state.provider = {
      name: 'METAMASK',
      isConnected: false,
      mismatchNetwork: false,
      network: ChainId.MAINNET,
    }
    state.account = {
      address: '',
      balance: '0',
      tokenBalance: '0',
    }
    state.loaders = {
      isConnecting: false,
      isChainChanging: false,
    }
  },
}

export const state = () => {
  return {
    provider: {
      name: 'METAMASK',
      isConnected: false,
      mismatchNetwork: false,
      network: ChainId.MAINNET,
    },
    account: {
      address: '',
      balance: '0',
      tokenBalance: '0',
    },
    loaders: {
      isConnecting: false,
      isChainChanging: false,
    },
  }
}
