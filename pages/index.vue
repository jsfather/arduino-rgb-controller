<script setup lang="ts">
const indexStore = useIndexStore()

await callOnce(indexStore.getBuiltInLed)

function toggleBuiltInLed() {
  if (indexStore.$state.builtInLed === 'off') {
    indexStore.setBuiltInLed({"led": 'on'})
  } else {
    indexStore.setBuiltInLed({"led": 'off'})
  }
}

const currentTime = ref('')

const $moment = useNuxtApp().$moment

const targetTime = $moment('14:12:30', 'HH:mm:ss')

const checkTime = (now: string) => {
  if (now === targetTime.format('HH:mm:ss')) {
    indexStore.setBuiltInLed({"led": 'on'})
  }
}

setInterval(() => {
  currentTime.value = $moment().format('HH:mm:ss')
}, 1000)

watch(currentTime, (newTime) => {
  checkTime(newTime)
})
</script>
<template>
  <div class="flex justify-center p-4">
    <div class="max-w-md p-6 bg-slate-700 rounded-lg shadow">
      <Icon
          :name="indexStore.$state.builtInLed ==='off' ? 'material-symbols:lightbulb-outline-rounded' : 'material-symbols:lightbulb-rounded'"
          size="50"
          class="text-white cursor-pointer" @click="toggleBuiltInLed"></Icon>
      <p class="text-white">Current Time: {{ currentTime }}</p>
    </div>

  </div>
</template>
