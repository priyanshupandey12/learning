import express from 'express';
import Redis from 'ioredis';


const app = express();



// Connect to Redis
const publisher = new Redis("redis://localhost:6380");

app.post('/publish',async(req,res)=>{
    const payload = {
        timestamp: new Date(),
        data: req.body
    }
  const sender=  await publisher.publish('my-channel', JSON.stringify(payload));
    res.json({message:`Message published to ${sender} subscribers`})
})


// Under the hood, the publisher will send messages to all subscribers of 'my-channel' in Redis. The subscriber will receive the message and can process it as needed.
// Note: In a real-world application, you would typically have the publisher and subscriber in separate services or applications, and they would communicate through Redis. 
// The above code is simplified for demonstration purposes.
//Understand the flow:
// 1. The publisher sends a message to the 'my-channel' channel in Redis.
// 2. The subscriber, which is subscribed to 'my-channel', receives the message and processes it (in this case, it logs the message to the console).
//now what  is publisher and subscriber in this context?
// In this context, the publisher is the part of the code that sends messages to a specific channel in Redis (in this case, 'my-channel'). It uses the Redis client to publish messages to that channel
// The subscriber is the part of the code that listens for messages on a specific channel (in this case, 'my-channel') and processes those messages when they are received. It uses the Redis client to subscribe to the channel and handle incoming messages.
//Real-world Eample to understand the flow better:
// Imagine you have a chat application where users can send messages to each other. When a user sends a message, 
// the application (acting as the publisher) publishes that message to a Redis channel (e.g., 'chat-channel').
// Other users (acting as subscribers) are subscribed to that channel and will receive the message in real-time.
// For instance, if User A sends a message "Hello, World!" to User B, the publisher will publish this message to 'chat-channel'.
// User B, who is subscribed to 'chat-channel', will receive the message "Hello, World!" and can display it in their chat interface.
//why do we use publisher and subscriber pattern?
// The publisher-subscriber pattern is used to decouple the components of a system, allowing them to communicate asynchronously.
// It enables a one-to-many relationship between the publisher and subscribers, where multiple subscribers can receive messages from a single publisher without needing to know about each other.
//what if i dont use publisher and subscriber pattern?
// If you don't use the publisher-subscriber pattern, you might end up with tightly coupled components that directly communicate with each other. This can lead to issues such as:
// 1. Scalability: It becomes difficult to scale the system as components are directly dependent on each other.
// 2. Maintenance: Changes in one component may require changes in other components, making maintenance more complex
// 3. Flexibility: It limits the flexibility of the system, as components cannot easily be added or removed without affecting others.
app.listen
(6000,()=>{
    console.log("Server is running on port 6000");
})