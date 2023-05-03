import Ajv, { ValidateFunction } from 'ajv'
import { BigNumberish, BigNumber } from 'ethers'

import { ChainId } from '@/types'

import { tornadoStatusSchemas } from './schemas'

const ajv = new Ajv({ allErrors: true, schemas: tornadoStatusSchemas })

ajv.addKeyword('BN', {
  // @ts-expect-error
  validate: (schema: never, data: BigNumberish) => {
    try {
      BigNumber.from(data)
      return true
    } catch (e) {
      return false
    }
  },
  errors: true,
})

function getRelayerValidateFunction(chainId: ChainId) {
  let getSchema
  switch (chainId) {
    case ChainId.BSC:
      getSchema = ajv.getSchema('bscRelayer')
      break
    case ChainId.GNOSIS:
      getSchema = ajv.getSchema('gnosisRelayer')
      break
    case ChainId.POLYGON:
      getSchema = ajv.getSchema('polygonRelayer')
      break
    case ChainId.AVALANCHE:
      getSchema = ajv.getSchema('avalancheRelayer')
      break
    case ChainId.ARBITRUM:
    case ChainId.OPTIMISM:
      getSchema = ajv.getSchema('l2Relayer')
      break
    default:
      getSchema = ajv.getSchema('defaultRelayer')
  }
  return getSchema as ValidateFunction<unknown>
}

export { getRelayerValidateFunction }
