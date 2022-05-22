const express = require('express');
const router = express.Router();
const db = require('../models/db')
const userController = require('../controllers/UserController')
const checkLogin = require('../auth/checkLogin')
const {check, validationResult} = require('express-validator')


const validator = [
    check('phoneNumber').exists().withMessage('Vui lòng nhập số điện thoại')
    .notEmpty().withMessage('Vui lòng không để trống số điện thoại')
    .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('email').exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Vui lòng không để trống email')
    .isEmail().withMessage('Email không hợp lệ'),
    
    check('name').exists().withMessage('Vui lòng nhập họ tên')
    .notEmpty().withMessage('Vui lòng không để trống họ tên'),

    check('birthday').exists().withMessage('Vui lòng nhập ngày sinh')
    .notEmpty().withMessage('Vui lòng không để trống ngày sinh')
    .isDate().withMessage('Ngày sinh không hợp lệ'),

    check('address').exists().withMessage('Vui lòng nhập địa chỉ')
    .notEmpty().withMessage('Vui lòng không để trống địa chỉ'),
    

]


/* GET users listing. */
router.get('/', checkLogin, userController.index);

router.get('/login', userController.login)

router.post('/login', userController.enter)

router.get('/signup', userController.signup)

router.post('/signup', validator, userController.register)

router.get('/user', validator, userController.user)

module.exports = router;
