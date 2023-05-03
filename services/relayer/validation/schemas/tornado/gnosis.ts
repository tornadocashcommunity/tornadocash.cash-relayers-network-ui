import { numbers, relayerAddressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAccount: relayerAddressType,
    instances: {
      type: 'object',
      properties: {
        xdai: {
          type: 'object',
          properties: {
            instanceAddress: {
              type: 'object',
              properties: {
                '100': relayerAddressType,
                '1000': relayerAddressType,
                '10000': relayerAddressType,
                '100000': relayerAddressType,
              },
              required: ['100', '1000', '10000', '100000'],
            },
            decimals: { enum: [numbers.ETH_DECIMALS] },
          },
          required: ['instanceAddress', 'decimals'],
        },
      },
      required: ['xdai'],
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
