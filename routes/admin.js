var express = require('express');
var router = express.Router();
const db = require('../models/db')
const adminController = require('../controllers/AdminController')
const checkLogin = require('../auth/checkLogin')

/* GET home page. */
router.get('/', checkLogin, adminController.index);

//[GET] list user
router.get('/list/user_wait', adminController.list_wait);
router.get('/list/user_actived', adminController.list_actived);
router.get('/list/user_block', adminController.list_block);
router.get('/list/user_block_infinity', adminController.list_block_infinity);

// [GET] Approve or Refuse withdraw money
router.get('/approve_withdraw_money', adminController.approve_withdraw_money);

module.exports = router;
