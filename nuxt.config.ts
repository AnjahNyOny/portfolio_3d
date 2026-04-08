export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-04-01',
  modules: [
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt'
  ],
  build: {
    transpile: [
      'three', 
      '@tresjs/core', 
      '@tresjs/cientos'
    ],
  },
  vite: {
    optimizeDeps: {
      include: [
        'object-hash', // CJS
        'glsl-tokenizer', // CJS
        'glsl-token-string', // CJS
        'glsl-token-functions', // CJS
        'three',
        'stats.js', // CJS
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  typescript: {
    shim: false
  }
})