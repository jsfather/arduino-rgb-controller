import type {Led} from "@/types/led"


export const useIndexStore = defineStore('indexStore', {
    state: () => ({
        led: {led: 0, color: '#808080'},
    }),
    actions: {
        async setLedState(state: Led) {
            const toastStore = useToastStore()
            try {
                this.led = await $fetch<Led>('/arduino/set', {
                    method: 'POST', body: state
                })
            } catch (error: Error | any) {
                toastStore.addToast({message: error, type: 'error', duration: 'permanent', dismissible: true})
            }
        },
        async getLedState() {
            const toastStore = useToastStore()
            try {
                this.led = await $fetch<Led>('/arduino/get')
            } catch (error: Error | any) {
                toastStore.addToast({message: error, type: 'error', duration: 'permanent', dismissible: true})
            }
        }
    }
})
