export type Url =
  | '/'
  | '/relayer'
  | '/workers'
  | '/registration'
  | '/registration/relayer'
  | '/registration/ens'
  | '/registration/workers'
  | '/registration/stake'
  | '/registration/summary'

export type PageName =
  | 'home'
  | 'registration'
  | 'requirements'
  | 'setupRelayer'
  | 'setupENS'
  | 'setupWorkers'
  | 'stake'
  | 'summary'
  | 'workers'
  | 'relayer'

export interface Link {
  url: Url
  title: string
}

export const pages: Record<PageName, PageName> = {
  home: 'home',
  workers: 'workers',
  relayer: 'relayer',
  registration: 'registration',
  requirements: 'requirements',
  setupRelayer: 'setupRelayer',
  setupENS: 'setupENS',
  setupWorkers: 'setupWorkers',
  stake: 'stake',
  summary: 'summary',
}

export const links = {
  [pages.home]: '/',
  [pages.workers]: '/workers',
  [pages.relayer]: '/relayer',
  [pages.registration]: '/registration',
  [pages.requirements]: '/registration',
  [pages.setupRelayer]: '/registration/relayer',
  [pages.setupENS]: '/registration/ens',
  [pages.setupWorkers]: '/registration/workers',
  [pages.stake]: '/registration/stake',
  [pages.summary]: '/registration/summary',
}

export const registerLinks = {
  [pages.requirements]: '/registration',
  [pages.setupRelayer]: '/registration/relayer',
  [pages.setupENS]: '/registration/ens',
  [pages.setupWorkers]: '/registration/workers',
  [pages.stake]: '/registration/stake',
  [pages.summary]: '/registration/summary',
}

export const menuLinks = {
  [pages.workers]: links.workers,
  [pages.registration]: links.registration,
}

export const instructions = {
  light: 'https://github.com/tornadocash/tornado-relayer/blob/light/README.md',
  relayer: 'https://github.com/tornadocash/tornado-relayer#deploy-with-docker-compose',
  nova: 'https://github.com/tornadocash/tornado-pool-relayer#deploy-with-docker-compose',
  burn: 'https://torn.community/t/proposal-relayer-registry-setting-parameters-after-audit/2134',
  formula: 'https://docs.tornado.cash/general/how-to-become-a-relayer#1.-warning-be-aware-and-accept-potential-risks',
}

// SOCIALS
export const DISCOURSE = 'https://torn.community'
export const DISCORD = 'https://discord.com/invite/TFDrM8K42j'
export const MEDIUM = 'https://tornado-cash.medium.com'
export const TWITTER = 'https://twitter.com/TornadoCash'
export const TELEGRAM = 'https://t.me/TornadoCashOfficial'
export const RELAYERS_TELEGRAM = 'https://t.me/+GV9sGO_3TJNiZGY7'
export const GITHUB = 'https://github.com/tornadocash'
export const TORNADO_CASH_LANDING = 'https://tornado.cash'
