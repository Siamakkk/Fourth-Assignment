const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.end('Will send you all the dishes')
})
.post((req, res) => {
    res.end(`Will add ${req.body.name} with detail : ${req.body.description} to the list`)
})
.put((req, res) => {
    res.statusCode = 403
    res.send('PUT method nost supported on /dishes')
})
.delete((req, res) => {
    res.end('Dleting all the dishes !!!')
})


//'/dishes/:dishId' route
dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res) => {
    res.write(`will send you information about dish number ${req.params.dishId} \n`)
    res.end(`Name of the dish you requested for info is : ${req.body.name} and its description is : ${req.body.description} `)
})
.post((req, res) => {
    res.statusCode = 403
    res.send(`POST method nost supported on /dishes/${req.params.dishId}`)
})
.put((req, res) => {
    res.write(`will modify dish number ${req.params.dishId} information \n`)
    res.end(`The dish has been changed to :
    name: ${req.body.name}
    description : ${req.body.description} `)
})
.delete((req, res) => {
    res.end(`Will delete dish number ${req.params.dishId} from the dishes`)
})

module.exports = dishRouter