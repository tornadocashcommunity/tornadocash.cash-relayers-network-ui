const validation = {
  INVALID_ENS: 'errors.validation.invalidEns',
  INVALID_ENS_DOMAIN: 'errors.validation.invalidEnsDomain',
  INVALID_RELAYER: 'errors.validation.invalidRelayer',
  INSUFFICIENT_FUNDS: 'errors.validation.insufficientFunds',
  INVALID_ADDRESS: 'errors.validation.invalidAddress',
  NOT_A_ADDRESS: 'errors.validation.noAAddress',
  INSUFFICIENT_INPUTS: 'errors.validation.insufficientInputs',
  INVALID_RELAYER_URL: 'errors.validation.invalidRelayerUrl',
  DIFFERENT_REWARD_ADDRESS: 'errors.validation.diffReward',
  CONTRACT_ADDRESS: 'errors.validation.contractAddress',
  ENS_NOT_A_OWNER: 'errors.validation.notOwnerEns',
  EXISTING_WORKER: 'errors.validation.existsWorker',
  ALREADY_REGISTERED_IN_POOL: 'errors.validation.alreadyRegistered',
  NOT_FOUND_ENS: 'errors.validation.notFoundEns',
  AMOUNT_GT_TORN_BALANCE: 'errors.validation.insufficientTORN',
  INSUFFICIENT_DATA: 'errors.validation.insufficientData',
  INSUFFICIENT_PERMIT_AMOUNT: 'errors.validation.insufficientPermit',
  INSUFFICIENT_APPROVE_AMOUNT: 'errors.validation.insufficientAllowance',
  AMOUNT_LT_MIN_STAKE: 'errors.validation.amountMustBeGreater',
  ENS_MAINNET_URL: 'errors.validation.ensMainnetUrl',
  TXT_WITH_PROTOCOL: 'errors.validation.withProtocol',
  WRONG_NETWORK: 'errors.validation.wrongNetwork',
  NO_RESPONSE: 'errors.validation.noResponse',
}

const wallet = {
  USER_DENIED: 'errors.wallet.userDenied',
  USER_REJECTED: 'errors.wallet.userRejected',
  LOCKED_PROVIDER: 'errors.wallet.lockedProvider',
  TRY_ADDING_THE_CHAIN: 'errors.wallet.tryAddingTheChain',
  ALREADY_PENDING: 'errors.wallet.alreadyPending',
  ALREADY_PROCESSING: 'errors.wallet.alreadyProcessed',
  FAILED_TX: 'errors.wallet.failedTx',
}

const relayer = {
  EMPTY_MAINNET: 'errors.relayer.emptyMainnet',
  NOT_REGISTERED: 'errors.relayer.notRegistered',
  FAILED_TO_FETCH: 'errors.relayer.failedToFetch',
  FAILED_MAINNET_STATUS: 'errors.relayer.failedMainnetStatus',
}

const errors = {
  wallet,
  relayer,
  validation,
}

export { errors }
