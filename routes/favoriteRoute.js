const express = require('express')
const bodyParser = require('body-parser')
const Favorite = require('../models/favorites')
const authenticate = require('../authenticate')
const cors = require('./cors')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .populate('faveDishes._id')
    .populate('user')
    .then((fav) => {
        if(!fav){
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')  
            return res.end(`not found any fav dishes`) 
            
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({favorites : fav})
    },(err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((fave) => {
        if(!fave){
            Favorite.create({user: req.user._id})
            .then((fave) => {
                req.body.forEach(dish => {
                    if(fave.faveDishes.id(dish._id)){
                        const err = new Error('You have already added this dish to your favorites! ')
                        err.status= 403
                        return next(err)
                    }
                    fave.faveDishes.push(dish)
                })
                fave.save()
                .then((fave) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(fave)
                }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        else {
            req.body.forEach(dish => {
                if(fave.faveDishes.id(dish._id)){
                    const err = new Error('You have already added this dish to your favorites! ')
                    err.status= 403
                    return next(err)
                }
                fave.faveDishes.push(dish)
            })
            fave.save()
            .then((fave) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(fave)
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    })
    .catch((err) => next(err))
})
.put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
    res.statusCode = 403
    res.end(`PUT operation not supported!`);
})
.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((fave) => {
        if(!fave){
            const err = new Error(`nothing to remove!`)
            err.status = 404
            return next(err)
        }
        fave.remove()
        .then((result) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .populate('faveDishes._id')
    .populate('user')
    .then((fav) => {
        if(!fav){
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')  
            return res.end(`not found any fav dishes`) 
        }else if (fav){
            
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
    res.statusCode = 403
    res.end(`PUT operation not supported!`);
})
.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((fave) => {
        if(!fave){
            Favorite.create({user: req.user._id})
            .then((fave) => {
                fave.faveDishes.push(req.params.dishId)
                fave.save()
                .then((fave) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(fave)
                }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        else {
            if(fave.faveDishes.id(req.params.dishId)){
                const err = new Error('You have already added this dish to your favorites! ')
                err.status= 403
                return next(err)
            }
            else {
                fave.faveDishes.push(req.params.dishId)
                fave.save()
                .then((fave) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(fave)
                }, (err) => next(err))
                .catch((err) => next(err))
            }
        }
    },(err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((fave) => {
        if(!fave){
            const err = new Error("You don't have a favoritelist! ")
            err.status= 403
            return next(err)
        }
        else {
            if(!fave.faveDishes.id(req.params.dishId)){
                const err = new Error("This dish dosen't exist in your favoritelist!")
                err.status= 403
                return next(err)  
            }
            fave.faveDishes.id(req.params.dishId).remove()
            fave.save()
            .then((result) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(result)
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    },(err) => next(err))
    .catch((err) => next(err))
})




module.exports = favoriteRouter


