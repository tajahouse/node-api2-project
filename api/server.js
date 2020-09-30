const express = require('express')
const lambdaRouter = require('../lambda/lambda-router')

const server = express();

server.use(express.json());

server.use("/api/posts", lambdaRouter)

server.use("/", (req,res)=>{
    res.json({
        message: 'Up and running'
    })

})
server.use((err, req, res, next)=>{
    res.status(500).json({ message: "Something is wrong "})
})

module.exports = server;