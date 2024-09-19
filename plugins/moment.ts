import {defineNuxtPlugin} from '#app'
import moment from 'moment'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('moment', moment)
})
