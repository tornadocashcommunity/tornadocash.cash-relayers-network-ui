import axios from 'axios'

import { ChainId, Relayer } from '@/types'

import { errors } from '@/constants'
import { getProvider, getRelayerValidateFunction } from '@/services'

import { GetTornadoStatusParams } from '../@types'

async function getRelayerData({ url, ensName, hasEnabledLightProxy, chainId = ChainId.MAINNET }: GetTornadoStatusParams) {
  let response = null

  try {
    if (!url) {
      throw new Error(errors.validation.INVALID_RELAYER)
    }

    response = await axios.get<Relayer>(`${url}/status`)
  } catch {
    if (ensName) {
      const relayerData = await getRelayerDataFromENS(ensName, chainId)

      if (relayerData) {
        await checkProtocol(relayerData.txt)
        response = await axios.get<Relayer>(`${relayerData.url}/status`)
      }
    }
  }

  if (!response) {
    throw new Error(errors.validation.NO_RESPONSE)
  }

  const validate = getRelayerValidateFunction(chainId)

  const isValid = await validate(response.data)

  if (!isValid) {
    return { isValid: false }
  }

  const version = hasEnabledLightProxy ? '5.' : '4.'
  const isOutdated = !response.data.version.startsWith(version)

  if (isOutdated) {
    console.error('askRelayerStatus', url || ensName, 'Outdated version.')
    return { isValid: false, address: response.data.rewardAccount, chainId: response.data.netId }
  }

  return { isValid, address: response.data.rewardAccount, chainId: response.data.netId }
}

function checkProtocol(txt: string) {
  if (txt.includes('http')) {
    throw new Error(errors.validation.TXT_WITH_PROTOCOL)
  }
}

async function getRelayerDataFromENS(ensName: string, chainId: ChainId = ChainId.MAINNET) {
  try {
    if (!ensName.includes('.eth')) {
      return undefined
    }

    const { provider } = getProvider(chainId)

    const resolver = await provider.getResolver(ensName)

    if (!resolver) {
      return undefined
    }

    const url = await resolver.getText('url')

    if (!url) {
      return undefined
    }

    return {
      txt: url,
      url: `${window.location.protocol}//${url}`,
      address: resolver.address,
    }
  } catch (err) {
    return undefined
  }
}

export const tornadoRelayerService = {
  checkProtocol,
  getRelayerData,
  getRelayerDataFromENS,
}
