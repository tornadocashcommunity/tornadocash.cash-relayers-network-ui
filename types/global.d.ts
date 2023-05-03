import { NotificationOptions } from 'vue-notification'
import { RpcProvider, ProviderInstance } from '@/services'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    provider: ProviderInstance
  }
}

declare global {
  interface Window {
    id: string
    ethereum: RpcProvider
    snarkjs: {
      groth16: {
        fullProve: CallableFunction
      }
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $preventMultitabs: () => void
    $set: <T>(object: object, key: string | number, value: T) => T
    $notification: (params: NotificationOptions) => void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $preventMultitabs: () => void
    $set: <T>(object: object, key: string | number, value: T) => T
    $notification: (params: NotificationOptions) => void
  }

  interface Context {
    $preventMultitabs: () => void
    $set: <T>(object: object, key: string | number, value: T) => T
    $notification: (params: NotificationOptions) => void
  }
}

declare module 'vuex/types/index' {
  interface Store {
    $preventMultitabs: () => void
    $set: <T>(object: object, key: string | number, value: T) => T
    $notification: (params: NotificationOptions) => void
  }
}
