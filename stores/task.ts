import type {Task} from "@/types/task"
import moment from "moment";

function sortByTime(tasks: Task[]) {
    return tasks.sort((a: Task, b: Task) => {
        const timeA = moment(a.time, 'HH:mm');
        const timeB = moment(b.time, 'HH:mm');

        return timeA.diff(timeB);
    });
}

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [] as Task[],
    }),
    actions: {
        async fetchTasks() {
            const data = await $fetch<Task[]>('/api/tasks');
            this.tasks = sortByTime(data) || [];
        },
        async addTask(task: Task) {
            const existingTaskIndex = this.tasks.findIndex(t => t.time === task.time);

            if (existingTaskIndex !== -1) {
                this.tasks[existingTaskIndex] = task;
            } else {
                this.tasks.push(task);
            }

            await this.saveTasks();
        },
        async deleteTask(index: number) {
            this.tasks.splice(index, 1);
            await this.saveTasks();
        },
        async saveTasks() {
            this.tasks = sortByTime(this.tasks)

            await $fetch('/api/tasks', {
                method: 'POST',
                body: {tasks: this.tasks},
            });
        },
    },
})
