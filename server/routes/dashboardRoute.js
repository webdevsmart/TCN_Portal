const express = require('express');
const dashboardCtrl = require('../controller/dashboardCtrl.js');
const router = express.Router();

router.post('/getTotalData', dashboardCtrl.getTotalData);
router.get('/getMachineList', dashboardCtrl.getMachineList);
router.post('/getDetail', dashboardCtrl.getDetail);

module.exports = router;
