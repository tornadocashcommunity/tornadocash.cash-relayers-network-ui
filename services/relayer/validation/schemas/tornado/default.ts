import { numbers, relayerAddressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAccount: relayerAddressType,
    instances: {
      type: 'object',
      properties: {
        dai: {
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
            tokenAddress: relayerAddressType,
            symbol: { enum: ['DAI'] },
            decimals: { enum: [numbers.ETH_DECIMALS] },
          },
          required: ['instanceAddress', 'tokenAddress', 'decimals'],
        },
        usdt: {
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
              required: ['100', '1000'],
            },
            tokenAddress: relayerAddressType,
            symbol: { enum: ['USDT'] },
            decimals: { enum: [numbers.USD_DECIMALS] },
          },
          required: ['instanceAddress', 'tokenAddress', 'decimals'],
        },
        usdc: {
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
              required: ['100', '1000'],
            },
            tokenAddress: relayerAddressType,
            symbol: { enum: ['USDC'] },
            decimals: { enum: [numbers.USD_DECIMALS] },
          },
          required: ['instanceAddress', 'tokenAddress', 'decimals'],
        },
        cdai: {
          type: 'object',
          properties: {
            instanceAddress: {
              type: 'object',
              properties: {
                '5000': relayerAddressType,
                '50000': relayerAddressType,
                '500000': relayerAddressType,
                '5000000': relayerAddressType,
              },
              required: ['5000', '50000', '500000', '5000000'],
            },
            tokenAddress: relayerAddressType,
            symbol: { enum: ['cDAI'] },
            decimals: { enum: [numbers.DAI_DECIMALS] },
          },
          required: ['instanceAddress', 'tokenAddress', 'decimals'],
        },
        wbtc: {
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
              required: ['0.1', '1', '10'],
            },
            tokenAddress: relayerAddressType,
            symbol: { enum: ['WBTC'] },
            decimals: { enum: [numbers.DAI_DECIMALS] },
          },
          required: ['instanceAddress', 'tokenAddress', 'decimals'],
        },
        eth: {
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
      required: ['eth'],
    },
    gasPrices: {
      type: 'object',
      properties: {
        fast: { type: 'number' },
        additionalProperties: { type: 'number' },
      },
      required: ['fast'],
    },
    netId: { type: 'integer' },
    ethPrices: {
      type: 'object',
      properties: {
        dai: { type: 'string', BN: true },
        cdai: { type: 'string', BN: true },
        usdc: { type: 'string', BN: true },
        usdt: { type: 'string', BN: true },
        torn: { type: 'string', BN: true },
        wbtc: { type: 'string', BN: true },
      },
      required: ['dai', 'cdai', 'usdc', 'usdt', 'torn', 'wbtc'],
    },
    tornadoServiceFee: { type: 'number', maximum: 20, minimum: 0 },
    miningServiceFee: { type: 'number', maximum: 20, minimum: 0 },
    latestBlock: { type: 'number' },
    version: { type: 'string' },
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
  required: ['rewardAccount', 'instances', 'netId', 'ethPrices', 'tornadoServiceFee', 'miningServiceFee', 'version', 'health'],
}

export { statusSchema }
