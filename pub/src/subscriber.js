import Redis from 'ioredis';


// Connect to Redis
const subscriber = new Redis("redis://localhost:6380");


subscriber.subscribe('my-channel', (err) => {
    if (err) {
        console.error('Failed to subscribe: %s', err.message);
        return;
    } else {
        console.log('Subscribed successfully!');
    }
});


subscriber.on('message', (channel, message) => {
    console.log("Received message from channel %s: %s", channel, JSON.parse(message));
    // Process the message as needed
});