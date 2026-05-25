import express from 'express';
import Redis from 'ioredis';
import {article} from './article.js';
import {user} from './user.js';


const app = express();
app.use(express.json());


// Connect to Redis
const redis = new Redis("redis://localhost:6380");


app.post('/post/:id/view',async(req,res)=>{
    const articleId=req.params.id;
    const views= await article.find((article)=>article.id===parseInt(articleId))
    if(views){
        const viewCount = await redis.incr(`article:${articleId}:views`);
        res.json({ views: viewCount });
    } else {
        res.status(404).json({ error: "Article not found" });
    }
});

app.get('/post/:id/views',async(req,res)=>{
    const articleId=req.params.id;
    const views= await article.find((article)=>article.id===parseInt(articleId))
    if(views){
        const viewCount = await redis.get(`article:${articleId}:views`);
        res.json({ views: parseInt(viewCount) || 0 ,article:views});
    } else {
        res.status(404).json({ error: "Article not found" });
    }
});


app.post('/leaderboard/:id/score', async (req, res) => {

    const userId = parseInt(req.params.id);

    const { score } = req.body;

   
    const existingUser = user.find(
        (u) => u.id === userId
    );

    if (!existingUser) {

        return res.status(404).json({
            error: "User not found"
        });

    }

   
    const updatedScore = await redis.zincrby(
        "leaderboard",
        score,
        existingUser.name
    );

    res.json({
        message: "Score updated",
        user: existingUser.name,
        updatedScore
    });

});

app.get('/leaderboard', async (req, res) => {

    const topUsers = await redis.zrevrange(
        "leaderboard",
        0,
        9,
        "WITHSCORES"
    );

    const leaderboard = [];

    for (let i = 0; i < topUsers.length; i += 2) {

        leaderboard.push({
            userId: topUsers[i],
            score: Number(topUsers[i + 1])
        });

    }

    res.json(leaderboard);

});

app.get('/liveleaderboard/:id/rank', async (req, res) => {

    const userId = parseInt(req.params.id);

    const FoundUser = user.find((u) => u.id === userId);

    if (!FoundUser) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    const rank = await redis.zrevrank(
        "leaderboard",
        FoundUser.name
    );

    if (rank === null) {

        return res.status(404).json({
            error: "User not found"
        });

    }

    res.json({
        user: FoundUser.name,
        rank: rank + 1
    });

});



app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})