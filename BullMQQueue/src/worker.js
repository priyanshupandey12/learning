//three parameters are required to create a worker
//1. queue name  like email, sms, notification
//2. business logic
//3. connection to redis

import { Worker } from 'bullmq';
import { connection } from './queue.js';


//worker syntax for email queue

const emailWorker = new Worker("emails",async (job)=>{
    console.log("Processing email job with data:",job.id,job.data);
    (await new Promise(resolve=>setTimeout(resolve,2000)),
     console.log("Email job completed with data:",job.id,job.data))
},{connection})

//listen to events emitted by the worker
//when a job is completed, the worker emits a "completed" event with the job data
//when a job fails, the worker emits a "failed" event with the job data and error message
//we can listen to these events and log the job data and error message to the console
//we have more event listeners like "active", "stalled", "progress", "drained"  etc. which we can use to monitor the worker and the jobs being processed
emailWorker.on("completed",(job)=>{
    console.log("Job completed with data:",job.id,job.data);
})

emailWorker.on("failed",(job,err)=>{
    console.log("Job failed with data:",job.id,job.data,"Error:",err);
})