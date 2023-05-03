import { numbers, relayerAddressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAccount: relayerAddressType,
    instances: {
      type: 'object',
      properties: {
        bnb: {
          type: 'object',
          properties: {
            instanceAddress: {
              type: 'object',
              properties: {
                '0.1': relayerAddressType,
                '1': relayerAddressType,
                '10': relayerAddressType,
                '100': relayerAddressType,
              },
              required: ['0.1', '1', '10', '100'],
            },
            decimals: { enum: [numbers.ETH_DECIMALS] },
          },
          required: ['instanceAddress', 'decimals'],
        },
      },
      required: ['bnb'],
    },
    netId: { type: 'integer' },
    tornadoServiceFee: { type: 'number', maximum: 20, minimum: 0 },
    health: {
      type: 'object',
      properties: {
        status: { const: 'true' },
        error: { type: 'string' },
      },
      required: ['status'],
    },
    currentQueue: { type: 'number' },
  },
  required: ['rewardAccount', 'instances', 'netId', 'tornadoServiceFee', 'health'],
}

export { statusSchema }
