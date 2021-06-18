const express = require('express');
const machinesCtrl = require('../controller/machine/machinesCtrl');
const planogramCtrl = require('../controller/machine/planogramCtrl');
const detailCtrl = require('../controller/machine/detailCtrl');
const router = express.Router();

router.post('/machines/getMachineList', machinesCtrl.getMachineList);
router.post('/machines/getMachineById', machinesCtrl.getMachineById);
router.post('/machines/setMachineConfig', machinesCtrl.setMachineConfig);

router.post('/detail/getBasicData', detailCtrl.getBasicData);
router.post('/detail/saveBasicData', detailCtrl.saveBasicData);
router.post('/detail/getConfigData', detailCtrl.getConfigData);
router.post('/detail/saveConfigData', detailCtrl.saveConfigData);
router.post('/detail/getCabinetLayoutData', detailCtrl.getCabinetLayoutData);
router.post('/detail/setCabinetLayout', detailCtrl.setCabinetLayout);
router.post('/detail/makeCabinet', detailCtrl.makeCabinet);
router.post('/detail/getAisle', detailCtrl.getAisle);
router.post('/detail/deleteAisle', detailCtrl.deleteAisle);
router.post('/detail/setAisle', detailCtrl.setAisle);
router.post('/detail/getRowConfig', detailCtrl.getRowConfig);
router.post('/detail/setRowConfig', detailCtrl.setRowConfig);

router.post('/planogram/makeCabinet', planogramCtrl.makeCabinet);
router.post('/planogram/getPlanogram', planogramCtrl.getPlanogram);
router.post('/planogram/addAisle', planogramCtrl.addAisle);
router.post('/planogram/getAisle', planogramCtrl.getAisle);
router.post('/planogram/setAisle', planogramCtrl.setAisle);



module.exports = router;
