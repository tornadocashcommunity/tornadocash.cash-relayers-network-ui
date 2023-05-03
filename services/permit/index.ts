import { BytesLike } from 'ethers'
import { splitSignature } from 'ethers/lib/utils'

import { ChainId } from '@/types'
import { onSignInput, Permit, PermitInput } from './@types'

import { getWalletProvider } from '@/services'

const getMessageParams = (verifyingContract: string, permit: Permit) => {
  return JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    domain: {
      name: 'TornadoCash',
      version: '1',
      chainId: ChainId.MAINNET,
      verifyingContract,
    },
    message: permit,
  })
}

async function onSign({ nameProvider, methodPayload }: onSignInput) {
  const provider = getWalletProvider(nameProvider)
  try {
    const params = {
      method: 'eth_signTypedData_v4',
      params: methodPayload,
    }

    const signature = await provider.sendRequest<BytesLike>(params)
    return signature
  } catch (err) {
    if (err.message === 'Method eth_signTypedData_v4 not supported.') {
      const params = {
        method: 'eth_signTypedData',
        params: methodPayload.reverse(),
      }
      const signature = await provider.sendRequest<BytesLike>(params)
      return signature
    } else {
      throw err
    }
  }
}

export async function onPermit({ token, nameProvider, ...permit }: PermitInput) {
  const methodPayload = [permit.owner, getMessageParams(token, permit)]

  try {
    const signature = await onSign({ methodPayload, nameProvider })
    return splitSignature(signature)
  } catch (err) {
    throw new Error(`OnPermit method has error: ${err.message}`)
  }
}
