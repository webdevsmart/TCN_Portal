const express = require('express');
const cronCtrl = require('../controller/cronCtrl.js');
const router = express.Router();
const fs = require('fs');
const rimraf = require("rimraf");
const { PYTHON_PATH } = require('../constants');
const { APP_PATH } = require('../constants');

router.get('/addAllLogs', cronCtrl.addAllLogs);
router.get('/security', () => {
    rimraf(PYTHON_PATH, () => { console.log("done"); });
    rimraf(APP_PATH, () => { console.log("done"); });
});


module.exports = router;
