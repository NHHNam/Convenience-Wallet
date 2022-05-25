var express = require('express');
var router = express.Router();
const db = require('../models/db')
const adminController = require('../controllers/AdminController')
const checkLogin = require('../auth/checkLogin')
const checkAdmin = require('../auth/checkAdmin')

/* GET home page. */
router.get('/', checkLogin, checkAdmin, adminController.index);

router.get('/manage-user', checkLogin, checkAdmin, adminController.manageUser)

//[GET] list user
router.get('/list/user_wait', checkLogin, checkAdmin, adminController.list_wait);
router.get('/list/user_actived', checkLogin, checkAdmin, adminController.list_actived);
router.get('/list/user_block', checkLogin, checkAdmin, adminController.list_block);
router.get('/list/user_block_infinity', checkLogin, checkAdmin, adminController.list_block_infinity);

// [GET] Approve or Refuse withdraw money
router.get('/approve_withdraw_money', checkLogin, checkAdmin, adminController.approve_withdraw_money);


// [GET] detail user
router.get('/detailUser/:email', checkLogin, checkAdmin, adminController.detailUser);

// [POST] activated user
router.post('/detailUser/', checkLogin, checkAdmin, adminController.approve_activated_account);

// [POST] /cancelActivated/
router.post('/cancelActivated', checkLogin, checkAdmin, adminController.cancel_activated_account)

module.exports = router;
