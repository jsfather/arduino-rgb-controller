import type {BuiltInLed} from "@/types/led"


export const useTagStore = defineStore('indexStore', {
    state: () => ({
        builtInLed: "off",
    }),
    actions: {
        async setBuiltInLed() {
            const toastStore = useToastStore()
            try {
                const data = await $fetch<BuiltInLed>('http://192.168.1.14/built-in-led')
                this.builtInLed = data.led
            } catch (error: Error | any) {
                toastStore.addToast({message: error, type: 'error', duration: 'permanent', dismissible: false})
            }
        }
    }
})
