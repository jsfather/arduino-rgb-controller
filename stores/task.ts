import type {Task} from "@/types/task"

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [] as Task[],
    }),
    actions: {
        async fetchTasks() {
            const data  = await $fetch<Task[]>('/api/tasks');
            this.tasks = data || [];
        },
        async addTask(task: Task) {
            this.tasks.push(task);
            await this.saveTasks();
        },
        async deleteTask(index: number) {
            this.tasks.splice(index, 1);
            await this.saveTasks();
        },
        async saveTasks() {
            await $fetch('/api/tasks', {
                method: 'POST',
                body: { tasks: this.tasks },
            });
        },
    },
})
