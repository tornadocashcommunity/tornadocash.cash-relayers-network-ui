import { BigNumberish } from 'ethers'
import { BytesLike } from '@ethersproject/bytes'

export type AddStakeParams = [string, BigNumberish]
export type AddStakePermitParams = [string, BigNumberish, string, BigNumberish, BigNumberish, BytesLike, BytesLike]
export type RelayerParsedVersion = {
  major: string
  minor: string
  patch: string
  prerelease?: string
}
