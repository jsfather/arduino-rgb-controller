import type {BuiltInLed} from "@/types/led"


export const useIndexStore = defineStore('indexStore', {
    state: () => ({
        builtInLed: "off",
    }),
    actions: {
        async setBuiltInLed(state: BuiltInLed) {
            const toastStore = useToastStore()
            try {
                const data = await $fetch<BuiltInLed>('/api/built-in-led/set', {
                    method: 'POST', body: state
                })
                this.builtInLed = data.led
            } catch (error: Error | any) {
                toastStore.addToast({message: error, type: 'error', duration: 'permanent', dismissible: false})
            }
        },
        async getBuiltInLed() {
            const toastStore = useToastStore()
            try {
                const data = await $fetch<BuiltInLed>('/api/built-in-led/get')
                this.builtInLed = data.led
            } catch (error: Error | any) {
                toastStore.addToast({message: error, type: 'error', duration: 'permanent', dismissible: false})
            }
        }
    }
})
