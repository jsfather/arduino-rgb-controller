import type {Task} from "@/types/task"

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [{time: '09:30:00', led: 'on', color: '#FF0000'},
            {time: '10:15:00', led: 'on', color: '#00FF00'},
            {time: '10:30:00', led: 'on', color: '#FF0000'},
            {time: '11:15:00', led: 'on', color: '#00FF00'},
            {time: '11:30:00', led: 'on', color: '#FF0000'},
            {time: '12:15:00', led: 'on', color: '#00FF00'},
        ] as Task[],
    }),
    actions: {
        addTask(task: Task) {
            this.tasks.push(task)
        },
        deleteTask(index: number) {
            this.tasks.splice(index, 1)
        }
    }
})
