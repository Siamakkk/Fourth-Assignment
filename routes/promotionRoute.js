const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')

const promotionRouter = express.Router()
const Promotion = require('../models/promotion')

promotionRouter.use(bodyParser.json())

// "/promotions" route 
promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find({})
    .then((docs)=> {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(docs)
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Promotion.create(req.body)
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
}, (err) => next(err))

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.deleteMany({})
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})

//"/promotions/promotionId" route
promotionRouter.route('/:promotionId')

.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then((promotion) => {
        if(promotion){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotion)
        }
        else{
            return next(new Error(`promotion with Id of ${req.params.promotionId} not found`)) 
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end(`Post not supported on promotions/promotionId`)
}, (err) => next(err))

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, { $set: req.body } ,{ new: true})
    .then((promotion) => {
        if(promotion){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotion)
        }
        else{
            return next(new Error(`promotion with Id of ${req.params.promotionId} not found`)) 
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then((result)=> {
        if(result){
            res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }else{
        return next(new Error(`promotion with Id of ${req.params.promotionId} not found`)) 
    }
    }, (err) => next(err))
 
    .catch((err) => next(err))   
})


module.exports = promotionRouter