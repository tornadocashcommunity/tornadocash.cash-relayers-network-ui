import { MAX_REDUCE_LENGTH, numbers } from '@/constants'

export const hashRender = (hash: string, size = Number('4'), separator = '...') => {
  return hash.slice(Number('0'), size) + separator + hash.slice(-size)
}

export const sliceHash = (hash: string) => {
  return '0x' + hashRender(hash.slice(Number('2')))
}

export const reduceText = (message: string, length = MAX_REDUCE_LENGTH) => {
  return message.length > length ? `${message.substring(numbers.ZERO, length)}...` : message
}

export const shortenText = (message: string, firstPartLength: number, secondPartLength: number) => {
  if (!message?.length) {
    return ''
  }
  return `${message.substring(numbers.ZERO, firstPartLength)}...${message.substring(secondPartLength)}`
}
