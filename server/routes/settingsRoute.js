const express = require('express');
const cronCtrl = require('../controller/cronCtrl.js');
const router = express.Router();

router.get('/addAllLogs', cronCtrl.addAllLogs);

module.exports = router;
