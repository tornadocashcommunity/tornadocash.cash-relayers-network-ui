import Ajv, { AsyncValidateFunction } from 'ajv'

import { ChainId } from '@/types'

import { novaStatusSchema } from './schemas'

const novaAjv = new Ajv()

novaAjv.addSchema(novaStatusSchema, 'relayer')

const getNovaRelayerValidateFunction = (chainId: ChainId) => {
  switch (chainId) {
    default:
      return novaAjv.getSchema('relayer') as AsyncValidateFunction
  }
}

export { getNovaRelayerValidateFunction }
