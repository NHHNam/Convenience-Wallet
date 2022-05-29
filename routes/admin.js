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
router.post('/detailUser/', checkLogin, adminController.approve_activated_account);

// [POST] /cancelActivated/
router.post('/cancelActivated', checkLogin, checkAdmin, adminController.cancel_activated_account)

// [POST] /admin/additionalRequest/
router.post('/additionalRequest', checkLogin, checkAdmin, adminController.additionalRequest)

// [POST] /admin/recoveryAccount/
router.post('/recoveryAccount', checkLogin, checkAdmin, adminController.recoveryAccount)

// [GET] /admin/detailNopRut/:id
router.get('/detailNopRut/:id', checkLogin, checkAdmin, adminController.detailNopRut)

// [GET] /admin/detailTransfer/:id
router.get('/detailTransfer/:id', checkLogin, checkAdmin, adminController.detailTransfer)

// [POST] /admin/approveNopRut
router.post('/approveNopRut', checkLogin, checkAdmin, adminController.approveNopRut)

// [POST] /admin/cancelNopRut
router.post('/cancelNopRut', checkLogin, checkAdmin, adminController.cancelNopRut)

// [POST] /admin/approveTransfer
router.post('/approveTransfer', checkLogin, checkAdmin, adminController.approveTransfer)

// [POST] /admin/cancelTransfer
router.post('/cancelTransfer', checkLogin, checkAdmin, adminController.cancelTransfer)

module.exports = router;
