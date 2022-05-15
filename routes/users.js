const express = require('express');
const router = express.Router();
const db = require('../models/db')
const userController = require('../controllers/UserController')

/* GET users listing. */
router.get('/', userController.index);

router.get('/login', userController.login)

router.post('/login', userController.enter)

module.exports = router;
