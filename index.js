const express = require('express');
const server = express();
const port = 5005

const postsRouter = require("./posts-router");

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get('/', (req, res) => {
    res.send('You\'ve got this Taja');
});

server.listen(port, ()=>{
    console.log(`Server listening on port: ${port}`)
})
