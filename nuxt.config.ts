import type { NuxtConfig } from '@nuxt/types'

import { execSync } from 'child_process'

function getCurrentCommit() {
  try {
    const from = 0
    const length = 7

    return execSync('git rev-parse HEAD').toString().trim().substr(from, length)
  } catch (e) {
    console.error('Failed to get git commit', e.message)
    return 'debug'
  }
}

const config: NuxtConfig = {
  target: 'static',
  ssr: false,

  generate: {
    concurrency: 1,
    fallback: true,
  },
  head: {
    title: 'Tornado Cash Relayers Network',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        hid: 'description',
        name: 'description',
        content: 'Tornado Cash decentralized Relayers Network',
      },
      {
        name: 'keywords',
        content: 'Privacy, Ethereum, ERC20, dapp, smart contract, decentralized, metamask, zksnark, zero knowledge',
      },
      {
        name: 'author',
        content: 'Tornado.cash',
      },
      {
        name: 'msapplication-TileColor',
        content: '#1d1e23',
      },
      { name: 'theme-color', content: '#1d1e23' },

      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Tornado Cash Relayers Network' },
      { property: 'og:site_name', content: 'Tornado Cash Relayers Network' },

      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '1200' },
      { property: 'og:image', content: 'https://tornado.cash/relayers-network.png' },

      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@TornadoCash' },
      { name: 'twitter:domain', content: 'https://tornado.cash' },
      { name: 'twitter:title', content: 'Tornado Cash Relayers Network' },
      {
        name: 'twitter:description',
        content: 'Tornado Cash decentralized Relayers Network',
      },
      {
        name: 'twitter:image:src',
        content: 'https://tornado.cash/relayers-network.png',
      },
      { name: 'twitter:image:alt', content: 'Tornado Cash Relayers Network' },
    ],
    link: [
      { rel: 'icon', href: '/icons/favicon.ico', sizes: 'any' },
      { rel: 'icon', href: '/icons/icon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  },

  css: ['@/assets/styles/index.scss'],

  plugins: [
    '@/plugins/ipfs.ts',
    '@/plugins/i18n.ts',
    '@/plugins/persist.ts',
    '@/plugins/vue-tooltip.ts',
    '@/plugins/placeholder.ts',
    '@/plugins/vue-js-modal.ts',
    '@/plugins/vue-notification.ts',
    '@/plugins/prevent-multitabs.ts',
  ],

  styleResources: {
    scss: ['@/assets/styles/_variables.scss', '@/assets/styles/*.scss'],
  },

  components: true,
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/',
        component: resolve(__dirname, 'pages/registration.vue'),
        children: [
          {
            path: '',
            component: resolve(__dirname, 'pages/registration/index.vue'),
          },
        ],
      })
    },
  },

  buildModules: ['@nuxt/typescript-build'],

  modules: ['@nuxtjs/style-resources'],

  build: {
    extend(config, { isClient }) {
      if (config?.output != null) {
        config.output.globalObject = 'this'
      }
    },
    html: {
      minify: {
        collapseWhitespace: true, // as @dario30186 mentioned
        removeComments: true, // 👈 add this line
      },
    },
    loaders: {
      fontUrl: { limit: 25000 },
      imgUrl: { limit: 15000 },
    },
    splitChunks: {
      layouts: false,
      pages: false,
      commons: false,
    },
  },

  env: {
    commit: getCurrentCommit(),
  },
}

export default config
