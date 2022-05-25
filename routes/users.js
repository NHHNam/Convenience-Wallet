const express = require('express');
const router = express.Router();
const db = require('../models/db')
const userController = require('../controllers/UserController')
const checkLogin = require('../auth/checkLogin')
const multer  = require('multer')
const checkChangePasswordFirst = require('../auth/checkChangePasswordFirst')
const Path = require('path')
const pathSave = Path.join(__dirname,'../uploads')
// console.log(pathSave)

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathSave)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })


const cpUpload = upload.fields([{ name: 'attachment1', maxCount: 1 }, { name: 'attachment2', maxCount: 1 }])

const path = require('path')
const fs = require('fs')

/* GET users listing. */
router.get('/', checkChangePasswordFirst, checkLogin, userController.index);

router.get('/login', userController.login)

router.post('/login', userController.enter)

router.get('/signup', userController.preRegister)

router.post('/signup', cpUpload, userController.Register)

router.get('/passwordFirst', checkLogin, userController.changeFirst)

router.post('/passwordFirst', checkLogin, userController.changeFirstPassword)

module.exports = router;
