import type {Task} from '@/types/task';

let tasks: Task[] = [{time: '09:30:00', led: 'on', color: '#FF0000'},
    {time: '10:15:00', led: 'on', color: '#00FF00'},
    {time: '10:30:00', led: 'on', color: '#FF0000'},
    {time: '11:15:00', led: 'on', color: '#00FF00'},
    {time: '11:30:00', led: 'on', color: '#FF0000'},
    {time: '12:15:00', led: 'on', color: '#00FF00'},
    {time: '13:30:00', led: 'on', color: '#FF0000'},
    {time: '14:15:00', led: 'on', color: '#00FF00'},
    {time: '14:30:00', led: 'on', color: '#FF0000'},
    {time: '15:15:00', led: 'on', color: '#00FF00'},
    {time: '15:30:00', led: 'on', color: '#FF0000'},
    {time: '16:15:00', led: 'on', color: '#00FF00'},
    {time: '16:30:00', led: 'on', color: '#FF0000'},
    {time: '17:00:00', led: 'on', color: '#00FF00'},
];

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'GET') {
        return tasks;
    }

    if (event.node.req.method === 'POST') {
        const body = await readBody(event);
        tasks = body.tasks || [];
        return {success: true};
    }
});
