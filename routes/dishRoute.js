const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const Dish = require('../models/dish')

const dishRouter = express.Router()

//parsing request body 
dishRouter.use(bodyParser.json())

// "/dishes" route
dishRouter.route('/')
.get((req, res, next) => {
    Dish.find({})
    .populate('comments.author')
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
    Dish.create(req.body)
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
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.deleteMany({})
    .then((result) => {
        res.json(result)
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})

// "/dishes/dishId" route
dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=> {
        if(dish){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }
        else{
            err = new Error(`dish withe id of ${req.params.dishId} not found`)
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('POST not supported')
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Dish.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true})
    .then((dish) => {
        if(dish) res.json(dish)
        else return next(new Error(`dish withe id of ${req.params.dishId} not found`))
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.findByIdAndDelete(req.params.dishId)
    .then((result) => {
        if(result) res.json(result)
        else return next(new Error(`dish withe id of ${req.params.dishId} not found`))
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})

// "/dishes/dishId/comments' route
dishRouter.route('/:dishId/comments')
.get(authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .populate('comments.author')
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
        next(err)
    })
})
.post(authenticate.verifyUser, (req, res, next) =>{
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            req.body.author = req.user._id
            dish.comments.push(req.body)
            dish.save()
            .then((dish) => {
                Dish.findById(dish._id)
                .populate('comments.author')
                .then((dish) =>{
                    res.statusCode = 200
                    res.setHeader('content-Type','application/json')
                    res.json(dish)
                },(err) => next(err))
            }, (err) => next(err))
        }
        else{
            err = new Error(`dish with Id of ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err)
    })
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end('PUT not supported')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
        next(err)
    })
})

// "/dishes/dishId/comments/commentId" route
dishRouter.route('/:dishId/comments/:commentId')
.get(authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .populate('comments.author')
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
        next(err)
    })
})

.put(authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)){
            const Comment = dish.comments.id(req.params.commentId)
            if(req.user._id.toString() === Comment.author._id.toString()){
                if(req.body.rating){
                    Comment.rating = req.body.rating
                }
                else if(req.body.comment){
                    Comment.Comment = req.body.comment
                }
                dish.save()
                .then((dish) => {
                    Dish.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200
                        res.setHeader('Content-type', 'application/json')
                        res.json(dish)
                    })
    
                }, (err) => next(err))
            }
            else {
                const err = new Error('Any user or an Admin cannot update or delete the comment posted by other users')
                err.status =403
                return next(err)
            }
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
        next(err)
    })
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html')
    res.end(`POST not supported on /dishes/${req.params.dishId}/:commentId`)
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)){
            const Comment = dish.comments.id(req.params.commentId)
            if(req.user._id.toString() === Comment.author._id.toString()){
                Comment.remove()
                dish.save()
                .then((dish) => {
                    Dish.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200
                        res.setHeader('Content-type', 'application/json')
                        res.json(dish)
                    })
                }, (err) => next(err))
            }
            else {
                const err = new Error('Any user or an Admin cannot update or delete the comment posted by other users')
                err.status =403
                return next(err)
            }
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
        next(err)
    })
})


module.exports = dishRouter