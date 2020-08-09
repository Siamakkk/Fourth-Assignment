const passport = require('passport')
const Localstrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')

const config = require('./config')
const user = require('./models/user')

//basic local authentication set-up
const local = passport.use(new Localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//creating tokens
const getToken = (user) => {
    return jwt.sign(user, config.secretKey, 
        { expiresIn : 36000 })
}

//options of jsonWebToken Strategy
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

//jwt authentication set-up
const jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(`jwt payload : `,jwt_payload)
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err){
            return done(err, false)
        }
        else if (user) {
            return done(null, user)
        }
        else {
            return done(null, false)
        }
    })

}))

//a middleware to limit routes to only registered users
const verifyUser = passport.authenticate('jwt', { session: false})
//a middleware to limit routes to only admin 
const verifyAdmin = function(req, res, next) {
    if(req.user.admin){
        return next()
    }else{
        const err = new Error(`You are not authorized to perform this operation!`)
        err.status = 403
        return next(err)
    }
}

const facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
},(accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id}, (err, user) => {
        if(err) return done(err, false)
        if(!err && user !== null){
            return done(null, user)
        }
        else {
            user = new User({ username : profile.displayName })
            user.facebookId = profile.id
            user.firstname = profile.name.givenName
            user.lastname = profile.name.familyName
            user.save((err, user) => {
                if(err) return done(err, false)
                else return done(null, user)
            })
        }
    })
}))



module.exports = {
    local,
    jwtPassport,
    verifyUser,
    getToken,
    verifyAdmin,
    facebookPassport
}