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

router.post('/planogram/makeCabinet', planogramCtrl.makeCabinet);
router.post('/planogram/getPlanogram', planogramCtrl.getPlanogram);
router.post('/planogram/addAisle', planogramCtrl.addAisle);
router.post('/planogram/deleteAisle', planogramCtrl.deleteAisle);
router.post('/planogram/getAisle', planogramCtrl.getAisle);
router.post('/planogram/setAisle', planogramCtrl.setAisle);



module.exports = router;
