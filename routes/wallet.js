var express = require('express');
var router = express.Router();
const db = require('../models/db')
const walletController = require('../controllers/WalletController')

/* GET users listing. */
router.get('/', walletController.index);

module.exports = router;
