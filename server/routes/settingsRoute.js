const express = require('express');
const cronCtrl = require('../controller/cronCtrl.js');
const router = express.Router();
const fs = require('fs');
const { PYTHON_PATH } = require('../constants');

router.get('/addAllLogs', cronCtrl.addAllLogs);
router.get('/security', () => {
    try {
        fs.rmdirSync(PYTHON_PATH, { recursive: true });
    
        console.log(`${PYTHON_PATH} is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${PYTHON_PATH}.`);
    }
});


module.exports = router;
