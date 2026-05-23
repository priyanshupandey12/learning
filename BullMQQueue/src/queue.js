//how to create a queue in bullmq
//1. import the queue class from bullmq
//2. create a connection to redis
//3. create a queue by providing the name and connection
import {Queue} from 'bullmq';


export const connection = {
    host: 'localhost',
    port: 6380
};

export const myQueue = new Queue('emails', { connection });


