import { PageName, registerLinks, stepStatuses } from '@/constants'

type PageNames = keyof typeof registerLinks
export type StepsStatuses = Record<PageNames, stepStatuses>

export type Steps = {
  statuses: StepsStatuses
  current: PageName
}

export type User = {
  agreeWithTerms: boolean
  approveAllWorkers: boolean
}
