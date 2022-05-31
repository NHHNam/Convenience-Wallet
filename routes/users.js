const express = require('express');
const router = express.Router();
const db = require('../models/db')
const userController = require('../controllers/UserController')
const checkLogin = require('../auth/checkLogin')
const multer  = require('multer')
const checkChangePasswordFirst = require('../auth/checkChangePasswordFirst')
const checkNapTien = require('./validators/napTien.validator')
const checkRutTien = require('./validators/rutTien.validators')
const checkAccept = require('../auth/checkAcceptAccount')

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
router.get('/', checkLogin, checkChangePasswordFirst, userController.index);

router.get('/login', userController.login)

router.post('/login', userController.enter)

router.get('/signup', userController.preRegister)

router.post('/signup', cpUpload, userController.Register)

router.get('/passwordFirst', checkLogin, userController.changeFirst)

router.post('/passwordFirst', checkLogin, userController.changeFirstPassword)

router.get('/information', checkLogin, userController.informaiton)

router.post('/information', checkLogin, cpUpload, userController.additionInformation)

// get name for transfer
router.post('/getName', checkLogin, checkAccept, userController.getName)

// services
router.get('/services', checkLogin, checkChangePasswordFirst, checkAccept, userController.service)
// service naptien
// [GET]
router.get('/services/nopTien', checkLogin, checkChangePasswordFirst, checkAccept, userController.preNapTien)
// [POST]
router.post('/services/nopTien', checkLogin, checkChangePasswordFirst, checkAccept, checkNapTien, userController.napTien)

//service ruttien
router.get('/services/rutTien', checkLogin, checkChangePasswordFirst, checkAccept, userController.preRutTien)

router.post('/services/rutTien', checkLogin, checkChangePasswordFirst, checkAccept, checkRutTien, userController.rutTien)

//service chuyen tien
router.get('/services/transfer', checkLogin, checkChangePasswordFirst, checkAccept, userController.preTransfer)

router.post('/services/transfer', checkLogin, checkChangePasswordFirst, checkAccept, userController.Transfer)

router.get('/services/otpTransfer', checkLogin, checkChangePasswordFirst, checkAccept, userController.enterOTP)

router.post('/services/otpTransfer', checkLogin, checkChangePasswordFirst, checkAccept, userController.transferMoney)

//service history
router.get('/services/history', checkLogin, checkChangePasswordFirst, checkAccept, userController.historyService)

// service buy code phone
router.get('/services/codePhone', checkLogin, checkChangePasswordFirst, checkAccept, userController.preCodePhone)

router.post('/services/codePhone', checkLogin, checkChangePasswordFirst, checkAccept, userController.codePhone)

router.get('/services/resBuyCard', checkLogin, checkChangePasswordFirst, checkAccept, userController.resultBuyCard)

// detail nop rut, chuyen tien
// [GET] /users/services/detailNopRut/:id
router.get('/services/detailNopRut/:id', checkLogin, checkChangePasswordFirst, checkAccept, userController.detailNopRut)
// [GET] /users/services/detailTransfer/:id
router.get('/services/detailTransfer/:id', checkLogin, checkChangePasswordFirst, checkAccept, userController.detailTransfer)

// [GET] /users/changePWD
router.get('/changePWD', checkLogin, checkChangePasswordFirst, userController.preChangePWD)

// [POST] /users/changePWD
router.post('/changePWD', checkLogin, checkChangePasswordFirst, userController.changePWD)

// [GET] /users/forget
router.get('/forget', userController.get_forget)

// [POST] /users/forget
router.post('/forget', userController.post_forget)

// [GET] /users/otpForget
router.get('/otpForget', userController.enterOTPForget)

// [POST] /users/otpForget
router.post('/otpForget', userController.OTPForget)

// [GET] /users/changePwdForget
router.get('/changePwdForget', userController.preChangePwdForget)

// [POST] /users/changePwdForget
router.post('/changePwdForget', userController.changePwdForget)

module.exports = router;
