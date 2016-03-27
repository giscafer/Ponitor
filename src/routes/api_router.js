'use strict'
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../common/auth');
const goodController = require('../controller/good');
const signController = require('../controller/sign');

/* good api. */
router.get('/good/:type', goodController.list);
router.get('/goodlist', authMiddleWare.userRequired,goodController.list);

router.post('/good', authMiddleWare.userRequired,goodController.save);

/**
 * signup login logout
 */
router.post('/signup',signController.signup);
router.post('/login',signController.login);
router.get('/logout',signController.logout);

module.exports = router;
