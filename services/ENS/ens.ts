import { ChainId } from '@/types'

import { getProvider } from '@/services'

async function getEnsOwner(ensName: string, chainId: ChainId) {
  try {
    const { provider } = getProvider(chainId)
    const ownerAddress = await provider.resolveName(ensName)

    return ownerAddress || undefined
  } catch (err) {
    return undefined
  }
}

async function getNameFromHash(ensHash: string) {
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
      body: JSON.stringify({
        query: `{
            domain(id: "${ensHash}") {
              name
            }
          }`,
      }),
      method: 'POST',
    })

    const { data } = await response.json()

    return data.domain.name
  } catch (err) {
    throw new Error(err.message)
  }
}
export { getEnsOwner, getNameFromHash }
