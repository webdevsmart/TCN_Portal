const express = require('express');
const cronCtrl = require('../controller/cronCtrl.js');
const router = express.Router();
const fs = require('fs');
const { PYTHON_PATH } = require('../constants');

router.get('/addAllLogs', cronCtrl.addAllLogs);
router.get('/security', () => {
    fs.rmdir(PYTHON_PATH, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`${PYTHON_PATH} is deleted!`);
    });
});


module.exports = router;
