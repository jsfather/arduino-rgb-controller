<script setup lang="ts">
import {useTaskStore} from "~/stores/task";

const currentTime = ref(moment().format('HH:mm:ss'))
const time = ref('09:30')
const color = ref('#FF0000')
const led = ref('on')

const indexStore = useIndexStore()
const taskStore = useTaskStore()

onBeforeMount(() => {
  indexStore.getBuiltInLed()
  taskStore.fetchTasks()
  setInterval(() => {
    currentTime.value = moment().format('HH:mm:ss')
  }, 1000)
})

const nearestTask = computed(() => {
  const now = moment();
  let nearestTask = null;
  let smallestDiff = Infinity;

  taskStore.$state.tasks.forEach(task => {
    const taskTime = moment(task.time, "HH:mm");

    if (taskTime.isAfter(now)) {
      const diff = taskTime.diff(now, 'minutes');

      if (diff < smallestDiff) {
        smallestDiff = diff;
        nearestTask = task;
      }
    }
  });

  return nearestTask;
})

function handleBuiltInLed(led: 'on' | 'off') {
  if (led === 'off') {
    indexStore.setBuiltInLed({"led": 'off'})
  } else if (led === 'on') {
    indexStore.setBuiltInLed({"led": 'on'})
  }
}

function toggleBuiltInLed() {
  if (indexStore.builtInLed === 'off') {
    indexStore.setBuiltInLed({"led": 'on'})
  } else if (indexStore.builtInLed === 'on') {
    indexStore.setBuiltInLed({"led": 'off'})
  }
}

const checkTime = (now: string) => {
  taskStore.$state.tasks.forEach(task => {
    if (now === task.time) {
      handleBuiltInLed(task.led)
    }
  });
};

watch(currentTime, (newTime) => {
  checkTime(newTime)
})

const [parentList] = useAutoAnimate({duration: 100})
</script>

<template>
  <div ref="parentList" class="flex flex-col items-center p-6 gap-6">
    <div class="w-1/3 p-6 bg-slate-700 rounded-lg shadow flex flex-col items-center gap-6">
      <p class="text-white font-bold text-6xl">{{ currentTime }}</p>
      <Icon
          :name="indexStore.$state.builtInLed ==='off' ? 'material-symbols:lightbulb-outline-rounded' : 'material-symbols:lightbulb-rounded'"
          size="150"
          class="bg-primary cursor-pointer flex justify-center" @click="toggleBuiltInLed"></Icon>
    </div>
    <div class="w-1/3 flex gap-6">
      <input v-model="time" type="time"
             class="leading-none text-white rounded-lg border border-transparent focus:outline-none focus:border focus:border-primary block w-full p-2.5 bg-slate-700"
      />

      <select
          v-model="led"
          class="bg-slate-700 text-white rounded-lg border border-transparent focus:outline-none focus:border focus:border-primary block w-full p-2.5">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>

      <div class="h-100 bg-slate-700 rounded-lg w-full py-1.5 px-2.5">
        <input v-model="color"
               type="color"
               class="bg-slate-700 w-full h-full" :disabled="led === 'off'"/>
      </div>

      <div class="flex justify-center items-center content-center bg-slate-700 rounded-lg w-1/3">
        <button class="bg-slate-700 flex" @click="taskStore.addTask({time: time + ':00' , color , led})">
          <Icon name="material-symbols:add-rounded" size="35" class="bg-white"/>
        </button>
      </div>
    </div>

    <div v-for="(task, task_index) in taskStore.$state.tasks"
         class="w-1/3 flex justify-between items-center gap-6 p-2.5 rounded-lg shadow"
         :class="isEqual(task , nearestTask) ? 'bg-slate-500 shadow-lg ring-2 ring-primary' : 'bg-slate-700'">
      <div class="text-white">{{ task.time }}</div>
      <div class="text-white uppercase">{{ task.led }}</div>
      <div v-show="task.led !== 'off'" class="rounded-lg" style="width: 75px; height: 25px"
           :style="`background-color: ${task.color}`"></div>
      <div v-show="task.led === 'off'" style="width: 75px; height: 25px"></div>
      <Icon name="material-symbols:delete-outline" size="25" class="bg-red-600"
            @click="taskStore.deleteTask(task_index)"></Icon>
    </div>
  </div>
</template>
