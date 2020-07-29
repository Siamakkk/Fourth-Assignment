const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.end('Will send all leaders to you')
})
.post((req, res) => {
    res.end(`Will add leader : ${req.body.name} with details : ${req.body.description}`)
})
.put((req, res) => {
    res.statusCode = 403
    res.end(`The PUT operation not supported on /leaders`)
})
.delete((req, res) => {
    res.end('All the leaders deleted')
})

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.end(`will send you information about leader with ID of : ${req.params.leaderId}`)
})
.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported  on /leaders/${req.params.leaderId}`)
})
.put((req, res) => {
    res.write(`updating the leader with ${req.params.leaderId} ID \n`)
    res.end(`will update the leader : ${req.body.name} with details : ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`will delete leader with ${req.params.leaderId} ID`)
})




module.exports = leaderRouter