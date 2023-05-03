import { numbers, relayerAddressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAccount: relayerAddressType,
    instances: {
      type: 'object',
      properties: {
        avax: {
          type: 'object',
          properties: {
            instanceAddress: {
              type: 'object',
              properties: {
                '10': relayerAddressType,
                '100': relayerAddressType,
                '500': relayerAddressType,
              },
              required: ['10', '100', '500'],
            },
            decimals: { enum: [numbers.ETH_DECIMALS] },
          },
          required: ['instanceAddress', 'decimals'],
        },
      },
      required: ['avax'],
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
