import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());


// Connect to Redis
const redis = new Redis("redis://localhost:6380");


app.get('/redis',async(req,res)=>{
    const reply= await redis.ping();
    res.send({redis:reply});
})

const BANNER_KEY = "banner";

app.post('/redis/banner',async(req,res)=>{
    const { message } = req.body;
    await redis.set(BANNER_KEY, message || "Hello, Redis!");
    res.send({ banner: message });
});

app.get('/redis/banner',async(req,res)=>{
    const banner = await redis.get(BANNER_KEY);
    res.send({ banner });
})

app.delete('/redis/banner',async(req,res)=>{
    await redis.del(BANNER_KEY);
    res.send({ message: "Banner deleted" });
})

app.get('/banner/exists',async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY);
    res.send({ exists: Boolean(exists) });
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})