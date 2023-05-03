import { estimateFees as estimate } from '@mycrypto/gas-estimation'

import { ChainId } from '@/types'
import { numberToHex } from '@/utilities'
import { numbers, RPC_LIST } from '@/constants'

export async function estimateFees(chainId: ChainId) {
  const { maxFeePerGas, maxPriorityFeePerGas, baseFee = numbers.ZERO } = await estimate(RPC_LIST[chainId])

  return {
    baseFee: numberToHex(baseFee),
    maxFeePerGas: numberToHex(maxFeePerGas),
    maxPriorityFeePerGas: numberToHex(maxPriorityFeePerGas),
  }
}
