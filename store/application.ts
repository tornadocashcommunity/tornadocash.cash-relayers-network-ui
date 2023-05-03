import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { RootState } from '@/types'
import { ApplicationMutation, ApplicationState } from '@/types/store/application'

import { errors, steps, stepStatuses, PageName } from '@/constants'
import { errorParser } from '@/utilities'

export const actions: ActionTree<ApplicationState, RootState> = {
  goNextStep({ commit, getters }, pageName) {
    this.$router.push(steps[pageName].link)

    commit(ApplicationMutation.SET_STEP_STATUS, {
      key: getters.currentStep,
      value: stepStatuses.COMPLETED,
    })

    commit(ApplicationMutation.SET_STEP_STATUS, {
      key: getters.stepConfig.next,
      value: stepStatuses.CURRENT,
    })

    commit(ApplicationMutation.SET_CURRENT_STEP, getters.stepConfig.next)
  },
  goPrevStep({ commit, getters }) {
    this.$router.push(steps[getters.stepConfig.prev].link)
    commit(ApplicationMutation.SET_CURRENT_STEP, getters.stepConfig.prev)
  },
  errorHandler(_, { errorMessage, title = '' }) {
    const errorText = errorParser(errorMessage)

    this.$notification({ type: 'error', title, text: errorText })

    if (errorMessage.includes(errors.validation.INSUFFICIENT_INPUTS)) {
      return errorMessage
    }
    return errorText
  },
}

export const getters: GetterTree<ApplicationState, RootState> = {
  currentStep: (state: ApplicationState) => {
    return state.steps.current
  },
  stepConfig: (state) => {
    return steps[state.steps.current]
  },
  isAgreeWithTerms: (state: ApplicationState) => {
    return state.user.agreeWithTerms
  },
  stepsStatuses: (state: ApplicationState) => {
    return state.steps.statuses
  },
  isApprovedAllWorkers: (state: ApplicationState) => {
    return state.user.approveAllWorkers
  },
  isCompletedStep: (state: ApplicationState) => (step: PageName) => {
    return state.steps.statuses[step] === stepStatuses.COMPLETED
  },
  isPendingStep: (state: ApplicationState) => (step: PageName) => {
    return state.steps.statuses[step] === stepStatuses.PENDING
  },
}

export const mutations: MutationTree<ApplicationState> = {
  [ApplicationMutation.SET_CURRENT_STEP](state, payload) {
    state.steps.current = payload
  },
  [ApplicationMutation.SET_TERMS_AGREE](state, payload) {
    state.user.agreeWithTerms = payload
  },
  [ApplicationMutation.SET_APPROVE_ALL_WORKERS](state, payload) {
    state.user.approveAllWorkers = payload
  },
  [ApplicationMutation.SET_STEP_STATUS](state, { key, value }) {
    // @ts-expect-error
    this._vm.$set(state.steps.statuses, key, value)
  },
  [ApplicationMutation.CLEAR_STATE](state) {
    state.steps = {
      statuses: {
        requirements: stepStatuses.CURRENT,
        setupRelayer: stepStatuses.PENDING,
        setupENS: stepStatuses.PENDING,
        setupWorkers: stepStatuses.PENDING,
        stake: stepStatuses.PENDING,
        summary: stepStatuses.PENDING,
      },
      current: 'requirements',
    }
    state.user = {
      agreeWithTerms: false,
      approveAllWorkers: false,
    }
  },
}

export const state = (): ApplicationState => {
  return {
    steps: {
      statuses: {
        requirements: stepStatuses.CURRENT,
        setupRelayer: stepStatuses.PENDING,
        setupENS: stepStatuses.PENDING,
        setupWorkers: stepStatuses.PENDING,
        stake: stepStatuses.PENDING,
        summary: stepStatuses.PENDING,
      },
      current: 'requirements',
    },
    user: {
      agreeWithTerms: false,
      approveAllWorkers: false,
    },
  }
}
