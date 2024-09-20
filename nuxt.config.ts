// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    ssr: false,
    modules: ['@nuxtjs/tailwindcss', 'nuxt-headlessui', "@nuxt/icon", "@pinia/nuxt", '@formkit/auto-animate/nuxt', "nuxt-lodash", '@vueuse/nuxt',],
    css: ['@/assets/css/main.css'],
    headlessui: {
        prefix: 'Headless'
    },
    nitro: {
        devProxy: {
            "/api": {
                target: "http://192.168.1.14",
                changeOrigin: true,
                prependPath: true,
            }
        }
    },
})