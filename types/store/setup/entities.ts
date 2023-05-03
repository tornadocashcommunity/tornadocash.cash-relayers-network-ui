import { BigNumberish } from 'ethers'
import { BytesLike } from '@ethersproject/bytes'

export type RegisterParams = [string, string, string[]]

export type RegisterPermitParams = [string, BigNumberish, string[], string, BigNumberish, BigNumberish, BytesLike, BytesLike]

export type ApproveParams = [string, BigNumberish]
