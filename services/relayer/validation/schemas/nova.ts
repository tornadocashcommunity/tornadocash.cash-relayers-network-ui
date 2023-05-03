import { relayerAddressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAddress: relayerAddressType,
    chainId: { type: 'number' },
    version: { type: 'string' },
    serviceFee: {
      type: 'object',
      properties: {
        transfer: {
          type: 'string',
        },
        withdrawal: {
          type: 'number',
          maximum: 20,
          minimum: 0,
        },
      },
    },
    health: {
      type: 'object',
      properties: {
        status: { const: true },
        error: { type: 'string' },
      },
      required: ['status'],
    },
  },
  required: ['rewardAddress', 'chainId', 'serviceFee', 'health'],
}

export { statusSchema as novaStatusSchema }
