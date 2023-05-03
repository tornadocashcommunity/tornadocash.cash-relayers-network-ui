import { EthEncryptedData } from 'eth-sig-util'
import { BigNumber, BigNumberish, utils } from 'ethers'
import { toChecksumAddress as checksumAddress } from 'web3-utils'

import { ChainId } from '@/types'

import { numbers } from '@/constants'

export function isAddress(value: string): string | false {
  try {
    return utils.getAddress(checksumAddress(value))
  } catch {
    return false
  }
}

// eslint-disable-next-line
export function toChecksumAddress(value: any): string {
  try {
    return checksumAddress(value)
  } catch {
    return ''
  }
}

export function toWei(value: string, uintName = 'ether') {
  return utils.parseUnits(String(value), uintName)
}

export function hexToNumber(hex: string) {
  return BigNumber.from(hex).toNumber()
}

export function generateAddress() {
  const RAND_BYTES = 20
  const MAX_LENGTH = 40

  return utils.getAddress(utils.hexlify(utils.randomBytes(RAND_BYTES)).substr(numbers.TWO).padStart(MAX_LENGTH, '0'))
}

export function numberToHex(value: number | bigint | string | BigNumberish) {
  return utils.hexlify(value)
}

// @ts-expect-error for set unitName init value
export function fromWei(balance: BigNumberish, unitName?: string | BigNumberish = numbers.ETH_DECIMALS) {
  return utils.formatUnits(balance, unitName)
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  5: 'goerli.',
  10: 'optimistic.',
  56: '',
  69: 'kovan-optimistic.',
  100: '',
}

export function getEtherscanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address' | 'block'): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function shortenAddress(address: string, chars = Number('4')): string {
  const parsed = isAddress(address)

  const SKIP_LENGTH = 42

  if (parsed === false) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return `${parsed.substring(numbers.ZERO, chars + numbers.TWO)}...${parsed.substring(SKIP_LENGTH - chars)}`
}

const BYTES_32 = 32
const NONCE_BUF_LENGTH = 24
const EPHEM_PUBLIC_KEY_BUF_LENGTH = 56

export function packEncryptedMessage(encryptedData: EthEncryptedData) {
  const nonceBuf = Buffer.from(encryptedData.nonce, 'base64')
  const ephemPublicKeyBuf = Buffer.from(encryptedData.ephemPublicKey, 'base64')
  const ciphertextBuf = Buffer.from(encryptedData.ciphertext, 'base64')

  const messageBuff = Buffer.concat([
    Buffer.alloc(NONCE_BUF_LENGTH - nonceBuf.length),
    nonceBuf,
    Buffer.alloc(BYTES_32 - ephemPublicKeyBuf.length),
    ephemPublicKeyBuf,
    ciphertextBuf,
  ])

  return '0x' + messageBuff.toString('hex')
}

export function unpackEncryptedMessage(encryptedMessage: string) {
  if (encryptedMessage.slice(numbers.ZERO, numbers.TWO) === '0x') {
    encryptedMessage = encryptedMessage.slice(numbers.TWO)
  }

  const messageBuff = Buffer.from(encryptedMessage, 'hex')
  const nonceBuf = messageBuff.slice(numbers.ZERO, NONCE_BUF_LENGTH)
  const ephemPublicKeyBuf = messageBuff.slice(NONCE_BUF_LENGTH, EPHEM_PUBLIC_KEY_BUF_LENGTH)
  const ciphertextBuf = messageBuff.slice(EPHEM_PUBLIC_KEY_BUF_LENGTH)

  return {
    version: 'x25519-xsalsa20-poly1305',
    nonce: nonceBuf.toString('base64'),
    ephemPublicKey: ephemPublicKeyBuf.toString('base64'),
    ciphertext: ciphertextBuf.toString('base64'),
  }
}

export function intParser(value: number, multiplier: number): string {
  return String(parseInt(String(value * multiplier)))
}

export function toDecimalsPlaces(value: number | string, decimals = numbers.PRECISION): string {
  const MIN_PRECISION = numbers.ONE / Math.pow(numbers.TEN, decimals)

  if (Number(value) < MIN_PRECISION && Number(value) > numbers.ZERO) {
    return `~${MIN_PRECISION}`
  }

  return Number(value).toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export function increaseByPercent(number: BigNumber, percent: number) {
  const onePercent = number.div(numbers.ONE_HUNDRED)

  return number.add(onePercent.mul(percent))
}

export function integerMultiplier(): BigNumber {
  return toWei('1', 'ether')
}

export const bump = (gas: BigNumber, percent: number) => gas.mul(percent).div(numbers.ONE_HUNDRED).toNumber()

export const gweiToWei = (value: number) => {
  const ceilValue = Math.ceil(value)
  const integerValue = parseInt(String(ceilValue))

  return toWei(String(integerValue), 'gwei')
}
