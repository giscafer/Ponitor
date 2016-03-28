'use strict'
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../common/auth');
const goodController = require('../controller/good');
const signController = require('../controller/sign');

/* good api. */
router.post('/good/:type', goodController.list);
router.post('/goodlist', authMiddleWare.userRequired,goodController.list);

router.post('/good', authMiddleWare.userRequired,goodController.save);
//del good
router.post('/good/del/:goodId', authMiddleWare.userRequired,goodController.del);

/**
 * signup login logout
 */
router.post('/signup',signController.signup);
router.post('/login',signController.login);
router.get('/logout',signController.logout);

module.exports = router;
