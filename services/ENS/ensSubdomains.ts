import { ChainId } from '@/types'

import { novaRelayerService, tornadoRelayerService } from '@/services'

import { GetSubdomainStatusParams, GetSubdomainWithStatusParams, relayerStatus, SubdomainInfo } from './@types'

const subdomains: Record<string, SubdomainInfo> = {
  mainnet: {
    title: 'mainnet',
    icon: 'mainnet',
    name: 'mainnet-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: false,
  },
  bsc: {
    title: 'BSC',
    icon: 'bsc',
    name: 'bsc-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  gnosis: {
    title: 'gnosis',
    icon: 'gnosis',
    name: 'gnosis-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  polygon: {
    title: 'polygon',
    icon: 'polygon',
    name: 'polygon-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  avalanche: {
    title: 'avalanche',
    icon: 'avalanche',
    name: 'avalanche-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  optimism: {
    title: 'optimism',
    icon: 'optimism',
    name: 'optimism-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  arbitrum: {
    title: 'arbitrum',
    icon: 'arbitrum',
    name: 'arbitrum-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: true,
  },
  goerli: {
    title: 'goerli',
    icon: 'goerli',
    name: 'goerli-tornado',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: false,
  },
  nova: {
    title: 'nova',
    icon: 'nova',
    name: 'gnosis-nova',
    status: relayerStatus.MISSING,
    hasEnabledLightProxy: false,
  },
}

async function getSubdomainStatus({ name, hasEnabledLightProxy, ensName, chainId }: GetSubdomainStatusParams) {
  const { getRelayerData, getRelayerDataFromENS } = tornadoRelayerService

  const relayerUrl = await getRelayerDataFromENS(ensName, chainId)

  if (!relayerUrl?.url) {
    return relayerStatus.MISSING
  }

  const key = Object.keys(subdomains).find((key) => subdomains[key].name === name)

  // @ts-expect-error
  const subdomainChainId = ChainId[key.toUpperCase()]

  const { isValid } = await getRelayerData({
    url: relayerUrl.url,
    hasEnabledLightProxy,
    chainId: subdomainChainId,
  })

  return isValid ? relayerStatus.SUCCESS : relayerStatus.FAILED
}

async function getNovaSubdomainStatus(ensName: string, chainId: ChainId) {
  const { getRelayerData, getRelayerDataFromENS } = novaRelayerService
  try {
    const relayerUrl = await getRelayerDataFromENS(ensName, chainId)

    if (!relayerUrl?.url) {
      return relayerStatus.MISSING
    }

    const { isValid } = await getRelayerData({
      url: relayerUrl.url,
      ensName,
      chainId,
    })

    return isValid ? relayerStatus.SUCCESS : relayerStatus.FAILED
  } catch (err) {
    console.error('Check Nova subdomain error:', window.$nuxt.$t(err.message))
    return relayerStatus.FAILED
  }
}

async function getSubdomainWithStatus({ subdomain, ensName, chainId }: GetSubdomainWithStatusParams) {
  const subdomainEnsName = `${subdomain.name}.${ensName}`
  subdomain = { ...subdomain, chainId, ensName: subdomainEnsName }

  try {
    if (subdomain.name === subdomains.nova.name) {
      const novaRelayerStatus = await getNovaSubdomainStatus(subdomainEnsName, chainId)
      return { ...subdomain, status: novaRelayerStatus }
    }

    const status = await getSubdomainStatus({
      chainId,
      name: subdomain.name,
      ensName: subdomainEnsName,
      hasEnabledLightProxy: subdomain.hasEnabledLightProxy,
    })
    return { ...subdomain, status }
  } catch (err) {
    console.error('Check subdomain error:', window.$nuxt.$t(err.message))
    return { ...subdomain, status: relayerStatus.FAILED }
  }
}

async function checkSubdomains(ensName: string, chainId: ChainId) {
  const promises = Object.values(subdomains).map((subdomain) => {
    return getSubdomainWithStatus({ subdomain, ensName, chainId })
  })

  const results = await Promise.all(promises)

  return results
}

export { checkSubdomains, subdomains }
