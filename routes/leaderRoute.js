const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const cors = require('./cors')

const leaderRouter = express.Router()
const leader = require('../models/leader.js')

//parsing body of request 
leaderRouter.use(bodyParser.json())

// "/leaders" route
leaderRouter.route('/')
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    console.log(leader)
    leader.find({})
    .then((docs)=> {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(docs)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    leader.create(req.body)
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
})
.delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leader.deleteMany({})
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err))
})

// "/leaders/leaderId" route
leaderRouter.route('/:leaderId')
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
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
.post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('POST not supported')
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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