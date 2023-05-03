import axios from 'axios'

import { ChainId, Relayer } from '@/types'

import { errors } from '@/constants'
import { getProvider, getNovaRelayerValidateFunction } from '@/services'

import { GetNovaStatusParams } from '../@types'

async function getRelayerData({ ensName, url, chainId }: GetNovaStatusParams) {
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

  const validate = getNovaRelayerValidateFunction(chainId)
  const isValid = await validate(response.data)

  return { isValid, address: response.data.rewardAddress, chainId: response.data.chainId }
}

function checkProtocol(txt: string) {
  if (txt.includes('http')) {
    throw new Error(errors.validation.TXT_WITH_PROTOCOL)
  }
}

async function getRelayerDataFromENS(ensName: string, chainId: ChainId) {
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

    return { url: `${window.location.protocol}//${url}`, address: resolver.address, txt: url }
  } catch (err) {
    return undefined
  }
}

export const novaRelayerService = {
  getRelayerData,
  getRelayerDataFromENS,
}
