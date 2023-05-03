import { checkSubdomains, subdomains } from './ensSubdomains'
import { getEnsOwner, getNameFromHash } from './ens'

export const ensService = {
  subdomains,
  getEnsOwner,
  checkSubdomains,
  getNameFromHash,
}
