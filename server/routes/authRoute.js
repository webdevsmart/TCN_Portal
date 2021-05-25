const express = require('express');
const authCtrl = require('../controller/authCtrl.js');
const router = express.Router();

router.post('/validate', authCtrl.validate);
router.post('/signup', authCtrl.signup);
router.post('/signin', authCtrl.signin);

module.exports = router;
