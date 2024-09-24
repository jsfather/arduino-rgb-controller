<script setup lang="ts">
const time = ref('07:00')
const color = ref('#FFFFFF')
const led = ref(0)

const indexStore = useIndexStore()
const taskStore = useTaskStore()

onMounted(() => {
  indexStore.getLedState()
  taskStore.fetchTasks()

  setInterval(() => {
    indexStore.getLedState()
  }, 10000);
})

const [parentList] = useAutoAnimate({duration: 100})
</script>

<template>
  <div class="flex flex-col items-center p-6 gap-6 select-none">
    <div class="w-full lg:w-3/5 xl:1/3 p-6 bg-slate-700 rounded-lg shadow flex flex-col items-center h-[200px]">
      <Icon
          v-if="indexStore.$state.led.led === 0"
          name="material-symbols:lightbulb-outline-rounded"
          size="150"
          class="cursor-pointer flex justify-center"
          style="background-color: #808080"
          @click="indexStore.setLedState({led: 1 , color: indexStore.$state.led.color})"/>
      <Icon
          v-else
          name="material-symbols:lightbulb-rounded"
          size="150"
          class="cursor-pointer flex justify-center"
          :style="`background-color: ${indexStore.$state.led.color}`"
          @click="indexStore.setLedState({led: 0 , color: indexStore.$state.led.color})"></Icon>
    </div>
    <div class="w-full lg:w-3/5 xl:1/3 grid grid-cols-4 gap-4">
      <input v-model="time" type="time"
             class="text-white rounded-lg border border-transparent focus:outline-none focus:border focus:border-primary px-2.5 bg-slate-700"
      />

      <select
          v-model="led"
          class="bg-slate-700 text-white rounded-lg border border-transparent focus:outline-none focus:border focus:border-primary  p-2.5">
        <option :value="1">On</option>
        <option :value="0">Off</option>
      </select>

      <div class="h-100 bg-slate-700 rounded-lg py-1.5 px-2.5">
        <input v-model="color"
               type="color"
               class="bg-slate-700 w-full h-full" :disabled="led === 0"/>
      </div>

      <div class="flex justify-center items-center content-center bg-slate-700 rounded-lg">
        <button class="bg-slate-700 flex" @click="taskStore.addTask({time: time + ':00' , color , led})">
          <Icon name="material-symbols:add-rounded" size="35" class="bg-white"/>
        </button>
      </div>
    </div>

    <div ref="parentList" class="w-full lg:w-3/5 xl:1/3 flex flex-col gap-6">
      <div v-for="(task, task_index) in taskStore.$state.tasks"
           class="w-full flex justify-between items-center bg-slate-700 p-2.5 rounded-lg shadow">
        <div class="text-white">{{ task.time }}</div>
        <div class="text-white">{{ task.led === 0 ? 'OFF' : 'ON' }}</div>
        <div v-show="task.led !== 0" class="rounded-lg" style="width: 75px; height: 25px"
             :style="`background-color: ${task.color}`"></div>
        <div v-show="task.led === 0" style="width: 75px; height: 25px"></div>
        <Icon name="material-symbols:delete-outline" size="25" class="bg-red-600"
              @click="taskStore.deleteTask(task_index)"></Icon>
      </div>
    </div>
  </div>
</template>
