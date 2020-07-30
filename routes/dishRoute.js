const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()

const Dish = require('../models/dish')

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.get((req, res, next) => {
    Dish.find({})
    .then((docs)=> {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(docs)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.post((req, res, next) =>{
    Dish.create(req.body)
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.put((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
})
.delete((req, res, next) => {
    Dish.deleteMany({})
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((doc)=> {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(doc)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.post((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('POST not supported')
})
.put((req, res, next) =>{
    Dish.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true})
    .then((doc) => {
        res.json(doc)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.delete((req, res, next) => {
    Dish.findByIdAndDelete(req.params.dishId)
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})

dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        }
        else {
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.post((req, res, next) =>{
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            dish.comments.push(req.body)
            dish.save()
            .then((result) => {
                res.statusCode = 200
                res.setHeader('content-Type','application/json')
                res.json(result)
        })
        }
        else{
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.put((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
})
.delete((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            dish.comments = []
            dish.save()
            .then((result) => {
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(result)
            })
        }
        else {
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            const Comment = dish.comments.id(req.params.commentId)
            if(Comment){
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(Comment)
            }
            else{
                err = new Error(`comment with Id of ${req.params.commentId} not found`)
                err.status = 404
                return next(err)
            }
        }
        else{
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.put((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        
        if(dish && dish.comments.id(req.params.commentId)){
            const Comment = dish.comments.id(req.params.commentId)
            if(req.body.rating){
                Comment.rating = req.body.rating
            }
            else if(req.body.comment){
                Comment.Comment = req.body.comment
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, (err) => next(err))
        }
        else if(dish === null){
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
        else{
            err = new Error(`comment with Id of ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})
.post((req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end(`POST not supported on /dishes/${req.params.dishId}/:commentId`)
})
.delete((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        
        if(dish && dish.comments.id(req.params.commentId)){
            const Comment = dish.comments.id(req.params.commentId)
            Comment.remove()
            dish.save()
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, (err) => next(err))
        }
        else if(dish === null){
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
        else{
            err = new Error(`comment with Id of ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        res.send(err.message)
    })
})


module.exports = dishRouter