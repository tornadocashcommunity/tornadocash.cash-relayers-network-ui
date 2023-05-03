import { numbers } from '@/constants'
import { BigNumber, BigNumberish } from 'ethers'

export function getBatches<T>(array: T[], batchSize: number) {
  const batches = []
  while (array.length) {
    batches.push(array.splice(numbers.ZERO, batchSize))
  }
  return batches
}

export async function sleep(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export function toHttps(link: string) {
  return link.replace('http://', 'https://')
}

export function isPositiveNumber(value: BigNumberish) {
  if (!value) {
    return false
  }
  return BigNumber.from(value).gt(numbers.ZERO)
}
