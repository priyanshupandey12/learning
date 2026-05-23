import express from 'express';
import {myQueue} from './queue.js';

const app = express();


app.use(express.json());

app.post('/welcome-email',async(req,res)=>{
     const job=myQueue.add("welcome-email",{
        email:req.body.email,
        name:req.body.name
        },
    {
        attempts:3, //number of times to retry the job if it fails
        backoff:{
            type:"exponential", //type of backoff strategy to use
            delay:1000 //delay in milliseconds before retrying the job

        }
    })
    res.json({message: 'Job added successfully', jobId: job.id});
});

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})