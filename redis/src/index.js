import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';


const app = express();



// Connect to Redis
const redis = new Redis("redis://localhost:6380");


app.get('/redis',async(req,res)=>{
    const reply= await redis.ping();
    res.send({redis:reply});
})


app.get('/mongo',async(req,res)=>{
    const reply= await mongoose.connect("mongodb://localhost:27017/mongodb");
     if(mongoose.connection.readyState===1){
        res.send({mongo:"Connected"});
     } else {
        res.send({mongo:"Not Connected"});
     }
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})