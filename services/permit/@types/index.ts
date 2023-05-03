export type Permit = {
  owner: string
  spender: string
  value: string
  nonce: number | string
  deadline: number | string
}

export type PermitInput = Permit & {
  token: string
  nameProvider: string
}

export type onSignInput = {
  nameProvider: string
  methodPayload: string[]
}
