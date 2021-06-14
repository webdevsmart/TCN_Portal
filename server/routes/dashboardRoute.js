const express = require('express');
const dashboardCtrl = require('../controller/dashboardCtrl.js');
const router = express.Router();

router.get('/getMachineList', dashboardCtrl.getMachineList);
router.get('/getSiteIDs', dashboardCtrl.getSiteIDs);
router.post('/getPriceData', dashboardCtrl.getPriceData);
router.post('/getDetail', dashboardCtrl.getDetail);
router.post('/getTodayData', dashboardCtrl.getTodayData);
router.post('/getChartData', dashboardCtrl.getChartData);
router.post('/getProductList', dashboardCtrl.getProductList);

module.exports = router;
