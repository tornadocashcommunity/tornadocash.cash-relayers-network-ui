import { links, pages } from '@/constants'

const steps = {
  [pages.requirements]: {
    current: pages.requirements,
    icon: 'requirement',
    title: 'components.stepper.titles.first',
    link: links.registration,
    next: pages.setupRelayer,
  },
  [pages.setupRelayer]: {
    current: pages.setupRelayer,
    icon: 'relayer',
    title: 'components.stepper.titles.second',
    link: links.setupRelayer,
    next: pages.setupENS,
    prev: pages.requirements,
  },
  [pages.setupENS]: {
    current: pages.setupENS,
    icon: 'subdomains',
    title: 'components.stepper.titles.third',
    link: links.setupENS,
    next: pages.setupWorkers,
    prev: pages.setupRelayer,
  },
  [pages.setupWorkers]: {
    current: pages.setupWorkers,
    icon: 'workers',
    title: 'components.stepper.titles.fourth',
    link: links.setupWorkers,
    next: pages.stake,
    prev: pages.setupENS,
  },
  [pages.stake]: {
    current: pages.stake,
    icon: 'stake',
    title: 'components.stepper.titles.fifth',
    link: links.stake,
    prev: pages.setupWorkers,
    next: pages.summary,
  },
  [pages.summary]: {
    current: pages.summary,
    icon: 'summary',
    title: 'components.stepper.titles.sixth',
    link: links.summary,
    prev: pages.stake,
  },
}

export { steps }
