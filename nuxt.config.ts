export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-04-01',

  // 🔍 SEO & Accessibilité
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Anjah Ny Ony — Développeur Web Fullstack | Portfolio 3D',
      meta: [
        { name: 'description', content: 'Portfolio interactif 3D de Anjah Ny Ony, développeur web fullstack spécialisé Vue.js, Nuxt, Node.js. Basé au Québec, Canada.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'Anjah Ny Ony — Web Developer' },
        { property: 'og:description', content: 'Découvrez mon portfolio interactif en 3D. Développeur fullstack Vue.js & Node.js au Québec.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://portfolio.anjahnyony.com' },
        { property: 'og:image', content: 'https://portfolio.anjahnyony.com/og-card.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Anjah Ny Ony — Web Developer' },
        { name: 'twitter:description', content: 'Portfolio interactif 3D — Développeur fullstack Vue.js & Node.js' },
        { name: 'twitter:image', content: 'https://portfolio.anjahnyony.com/og-card.png' },
        { name: 'theme-color', content: '#09090b' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/ar-white.svg' },
      ],
    },
  },

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
    build: {
      // Source maps pour le debugging en production
      sourcemap: true,
      // Optimisation du bundle JS
      rollupOptions: {
        output: {
          // Code splitting : séparer Three.js dans son propre chunk
          manualChunks(id) {
            if (id.includes('three')) {
              return 'three-vendor'
            }
            if (id.includes('@tresjs')) {
              return 'tresjs-vendor'
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'object-hash',
        'glsl-tokenizer',
        'glsl-token-string',
        'glsl-token-functions',
        'three',
        'stats.js',
        'gsap',
      ]
    }
  },

  typescript: {
    shim: false
  }
})