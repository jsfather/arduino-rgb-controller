import type {Task} from '@/types/task';
import {defineEventHandler} from 'h3';
import {readBody} from 'h3';
import axios from 'axios';
import schedule from 'node-schedule';
import moment from 'moment';

let tasks: Task[] = [{time: '09:30:00', led: 1, color: '#FF0000'},
    {time: '10:15:00', led: 1, color: '#00FF00'},
    {time: '10:30:00', led: 1, color: '#FF0000'},
    {time: '11:15:00', led: 1, color: '#00FF00'},
    {time: '11:30:00', led: 1, color: '#FF0000'},
    {time: '12:15:00', led: 1, color: '#00FF00'},
    {time: '13:30:00', led: 1, color: '#FF0000'},
    {time: '14:15:00', led: 1, color: '#00FF00'},
    {time: '14:30:00', led: 1, color: '#FF0000'},
    {time: '15:15:00', led: 1, color: '#00FF00'},
    {time: '15:30:00', led: 1, color: '#FF0000'},
    {time: '16:15:00', led: 1, color: '#00FF00'},
    {time: '16:30:00', led: 1, color: '#FF0000'},
    {time: '17:00:00', led: 1, color: '#00FF00'},
];

const scheduleTasks = () => {
    tasks.forEach(task => {
        const taskTime = moment(task.time, 'HH:mm:ss');
        const now = moment();

        if (taskTime.isAfter(now)) {
            schedule.scheduleJob(taskTime.toDate(), async () => {
                try {
                    await axios.post('http://192.168.31.169/set', {led: task.led, color: task.color});
                } catch (error) {
                    console.error(`Failed to execute task at ${task.time}:`, error);
                }
            });
        }
    });
};

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'GET') {
        return tasks;
    }

    if (event.node.req.method === 'POST') {
        const body = await readBody(event);
        tasks = body.tasks || [];
        scheduleTasks();
        return {success: true};
    }
});

scheduleTasks();