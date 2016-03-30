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
router.get('/active_account',signController.activeAccount);//账号激活
router.post('/searchpass',signController.searchPass);//获取重置邮箱
router.post('/resetvalid',signController.resetValid);//验证
router.post('/updatepass',signController.updatePass);//重置密码

module.exports = router;
