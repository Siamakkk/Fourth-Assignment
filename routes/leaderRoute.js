const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()
const leader = require('../models/leader.js')

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.get((req, res, next) => {
    console.log(leader)
    leader.find({})
    .then((docs)=> {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(docs)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) =>{
    leader.create(req.body)
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
})
.delete((req, res, next) => {
    leader.deleteMany({})
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err))
})

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    leader.findById(req.params.leaderId)
    .then((doc)=> {
        if(doc){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(doc)
        }
        else{
            return next(new Error(`Error 404 : leader with the Id of ${req.params.leaderId} not found`))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('POST not supported')
})
.put((req, res, next) => {
    leader.findByIdAndUpdate(req.params.leaderId, { $set: req.body}, { new: true})
    .then((doc)=> {
        if(doc){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(doc)
        }
        else{
            return next(new Error(`Error 404 : leader with the Id of ${req.params.leaderId} not found`))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
    leader.findByIdAndDelete(req.params.leaderId)
    .then((result)=> {
        if(result){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        }
        else{
            return next(new Error(`Error 404 : leader with the Id of ${req.params.leaderId} not found`))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})




module.exports = leaderRouter