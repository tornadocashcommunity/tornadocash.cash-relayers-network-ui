import axios from 'axios'

import { ChainId, Relayer, RelayerParsedVersion } from '@/types'

import { errors } from '@/constants'
import { getProvider, getRelayerValidateFunction } from '@/services'

import { GetTornadoStatusParams, RelayerParsedData } from '../@types'

async function getRelayerData({
  url,
  ensName,
  hasEnabledLightProxy,
  chainId = ChainId.MAINNET,
}: GetTornadoStatusParams): Promise<RelayerParsedData> {
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

  const semVerRegex =
    /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  const regexpResult = semVerRegex.exec(response.data.version)
  const invalidVersionData = { isValid: false, address: response.data.rewardAccount, chainId: response.data.netId }

  if (!regexpResult?.groups) {
    console.error('askRelayerStatus', url || ensName, 'Version specified incorrectly.')
    return invalidVersionData
  }

  const { major } = regexpResult.groups as RelayerParsedVersion
  const minimalMajorVersion = 5
  const isMajorVersionUpdated = Number(major) >= minimalMajorVersion

  if (!isMajorVersionUpdated) {
    console.error('askRelayerStatus', url || ensName, 'Outdated version.')
    return invalidVersionData
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
