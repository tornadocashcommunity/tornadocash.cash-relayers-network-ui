import { errors, numbers } from '@/constants'

type WalletErrorKey = keyof typeof errors.wallet

function onSearchErrorKey<K extends string>(errorKey: K, errorMessage: string) {
  const parsedKey = errorKey.toLowerCase().replaceAll('_', ' ')
  return errorMessage.toLowerCase().includes(parsedKey)
}

export function errorParser(errorMessage: string, fallBackError?: string) {
  const expectedValidationError = Object.values(errors.validation).find((errorText) => errorMessage.includes(errorText))

  if (expectedValidationError) {
    return expectedValidationError
  }

  const walletErrorKeys = Object.keys(errors.wallet) as WalletErrorKey[]
  const walletErrorKey = walletErrorKeys.find((errorKey) => onSearchErrorKey<WalletErrorKey>(errorKey, errorMessage))
  if (walletErrorKey) {
    return errors.wallet[walletErrorKey]
  }

  const nodeMatchedError = errorMessage.match(/"(?:message|reason)":"([^"]+)/)
  if (nodeMatchedError) {
    return nodeMatchedError[numbers.ONE]
  }

  const matchedError = errorMessage.match(/(?:message|reason)":"(.+)"/)
  if (matchedError) {
    return matchedError[numbers.ONE]
  }

  const contractMessage = errorMessage.match(/\\"(?:message|reason)\\":\\".*'(.+)'\\"}}"/)
  if (contractMessage) {
    return contractMessage[numbers.ONE]
  }

  if (fallBackError) {
    return fallBackError
  }
  return errorMessage
}
