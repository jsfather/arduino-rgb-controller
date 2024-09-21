// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    modules: ['@nuxtjs/tailwindcss', 'nuxt-headlessui', "@nuxt/icon", "@pinia/nuxt", '@formkit/auto-animate/nuxt', "nuxt-lodash", '@vueuse/nuxt',],
    css: ['@/assets/css/main.css'],
    headlessui: {
        prefix: 'Headless'
    },
    nitro: {
        devProxy: {
            "/arduino": {
                target: "http://192.168.1.14",
                changeOrigin: true,
                prependPath: true,
            }
        }
    },
})