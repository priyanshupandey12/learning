import express, { json } from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());


// Connect to Redis
const redis = new Redis("redis://localhost:6380");


app.post('/user/:id/json',async(req,res)=>{
    await redis.set(`user${req.params.id}:json`,JSON.stringify(req.body));
    res.json({savedAs:"json"})
})


app.get('/user/:id/json',async(req,res)=>{
    const raw=await redis.get(`user${req.params.id}:json`);
    res.json({savedAs:raw ? JSON.parse(raw):null})
})

app.post('/user/:id/hash',async(req,res)=>{
    await redis.hset(`user${req.params.id}:hash`,req.body);
    res.json({savedAs:"hash"})
})


app.get('/user/:id/hash',async(req,res)=>{
    const user=await redis.hgetall(`user${req.params.id}:hash`);
    res.json({savedAs:user})
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})