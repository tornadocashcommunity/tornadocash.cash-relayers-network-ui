import { ethers } from 'ethers'

import { ConnectionInfo } from '@ethersproject/web'
import { Networkish } from '@ethersproject/networks'

import { sleep } from '@/utilities'
import { numbers } from '@/constants'

export class ExtendedProvider extends ethers.providers.StaticJsonRpcProvider {
  public constructor(url?: ConnectionInfo | string, network?: Networkish) {
    super(url, network)
  }

  // @ts-expect-error
  public async send(method: string, params: never[], retryAttempt: number = numbers.ZERO) {
    try {
      return await super.send(method, params)
    } catch (err) {
      if (!retryAttempt) {
        console.warn(`ExtendedProvider send ${method} has error:`, err.message)

        const TIME_OUT = 3000

        await sleep(TIME_OUT)

        return this.send(method, params, ++retryAttempt)
      }
      throw err
    }
  }

  // private checkRpcError(err: { data: string; code: string; message: string }) {
  //   const code = String(err?.code)
  //   const data = err.data?.toLowerCase()
  //   const message = err.message?.toLowerCase()

  //   const ERROR_DATA = 'too many concurrent request'
  //   const ERROR_MESSAGE = 'timeout'
  //   const ERROR_CODE = '-32017'

  //   return (data?.includes(ERROR_DATA) || message?.includes(ERROR_MESSAGE)) && code === ERROR_CODE
  // }
}
