const express = require('express')
const bodyParser = require('body-parser')

const promotionRouter = express.Router()

promotionRouter.use(bodyParser.json())

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.end('Will send all promotions to you')
})
.post((req, res) => {
    res.end(`Will add promotion : ${req.body.name} with details : ${req.body.description}`)
})
.put((req, res) => {
    res.statusCode = 403
    res.end(`The PUT operation not supported on /promotions`)
})
.delete((req, res) => {
    res.end('All the promotions deleted')
})

promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.end(`will send you information about promotion with ID of : ${req.params.promotionId}`)
})
.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported  on /promotions/${req.params.promotionId}`)
})
.put((req, res) => {
    res.write(`updating the promotion with ${req.params.promotionId} ID \n`)
    res.end(`will update the promotion : ${req.body.name} with details : ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`will delete promotion with ${req.params.promotionId} ID`)
})




module.exports = promotionRouter