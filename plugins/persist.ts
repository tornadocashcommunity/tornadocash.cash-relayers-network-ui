import { Plugin } from '@nuxt/types'

import createPersistedState from 'vuex-persistedstate'

const persist: Plugin = ({ store, isHMR }) => {
  if (isHMR) {
    return
  }

  const paths = ['setup', 'gasPrice', 'transaction', 'application', 'wallet.provider', 'wallet.account']

  createPersistedState({
    key: 'tornado_relayer_registry',
    paths,
  })(store)
}

export default persist
