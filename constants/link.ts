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
  relayer: 'https://git.tornado.ws/tornadocash/classic-relayer/src/branch/main-v5#deploy-with-script-and-docker-compose',
  nova: 'https://git.tornado.ws/tornadocash/nova-relayer#deploy-with-docker-compose',
  burn: 'https://torn.community/t/proposal-relayer-registry-setting-parameters-after-audit/2134',
  formula:
    'https://docs.tornado.ws/general/guides/relayer.html#1-the-relayer-selection-system-how-a-relayer-is-chosen-by-frontends',
}

// SOCIALS
export const DISCOURSE = 'https://forum.tornado.ws'
export const MEDIUM = 'https://tornado-cash.medium.com'
export const TWITTER = 'https://twitter.com/TornadoCash'
export const TELEGRAM = 'https://t.me/TornadoOfficial'
export const RELAYERS_TELEGRAM = 'https://t.me/+XDpY3mCr9UU2MGI0'
export const GITHUB = 'https://git.tornado.ws'
export const TORNADO_CASH_LANDING = 'https://tornado.ws'
