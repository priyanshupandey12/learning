import express, { json } from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());


// Connect to Redis
const redis = new Redis("redis://localhost:6380");

// Generate OTP
 function optKey(phoneNumber) {
    return `otp:${phoneNumber}`;
 }

app.post('/generate-otp', async (req, res) => {
    const {phoneNumber} =req.body
   const otp = Math.floor(10000+Math.random()*900000).toString()

   await redis.set(optKey(phoneNumber),otp,'EX',300)
   res.json({message:"otp gya",otp})
})


app.post('/otp/verify',async(req,res)=>{
    const {phoneNumber,otp} =req.body
    const savedOtp=await redis.get(optKey(phoneNumber))

    if(!savedOtp) {
         return res.status(400).json({message:"otp expired"})
    }

    if(savedOtp!==otp) {
          return res.status(400).json({message:"invalid otp"})
    }

    await redis.del(optKey(phoneNumber))


    return res.status(200).json({message:"otp verified successfully "})

})


app.get('/otp/:phone/ttl',async(req,res)=>{
   const ttl=await redis.ttl(optKey(req.params.phone))
   res.json({ttl})
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})