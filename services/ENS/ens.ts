import { BigNumber } from 'ethers'
import { namehash } from 'ethers/lib/utils'

import { ChainId } from '@/types'
import { getEnsRegistry } from '@/contracts'

async function getEnsOwner(ensName: string, chainId: ChainId) {
  try {
    const node = namehash(ensName)
    const ensContract = getEnsRegistry(chainId)

    const owner = await ensContract.callStatic.owner(node)

    if (BigNumber.from(owner).isZero()) {
      return undefined
    }

    return owner
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
