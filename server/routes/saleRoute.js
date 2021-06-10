const express = require('express');
const totalCtrl = require('../controller/sale/totalCtrl.js');
const router = express.Router();

router.post('/total/getTransactionList', totalCtrl.getTransactionList);

module.exports = router;
