const express = require('express')
const bodyParse = require('body-parser')
const multer = require('multer')
const path = require('path')
const authenticate = require('../authenticate')
const cors = require('./cors')

const UploadRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const imageFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return cb(new Error('Only images are allowed'))
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter })

UploadRouter.use(bodyParse.json())

UploadRouter.route('/')
.options(cors.corsWithOption, (req, res) => { res.sendStatus = 200 })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('GET operation not supported on /imageUpload')
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /imageUpload')
})
.delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /imageUpload')
})
.post(cors.corsWithOption ,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res , next) => {
    res.statusCode = 200
    res.setHeader('Comtent-Type', 'application/json')
    res.json(req.file)
},)


module.exports = UploadRouter