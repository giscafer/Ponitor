/**
 * api 路由
 */
'use strict'
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../common/auth');
const goodController = require('../controller/good');
const chartsController = require('../controller/charts');
const signController = require('../controller/sign');
const userController = require('../controller/user');
//
const  gitBatchCtrl=require('../git-batch-file-builder/createBatch.js');

/* good api. */
router.post('/good/:type', goodController.list);
router.post('/chart/:gid', chartsController.showChart);
router.post('/goodlist', authMiddleWare.userRequired,goodController.list);

router.post('/good', authMiddleWare.userRequired,goodController.save);
//del good
router.post('/good/del/:goodId', authMiddleWare.userRequired,goodController.del);
//统计商品数量
router.get('/good/count',goodController.count);

/**
 * signup login logout
 */
router.post('/signup',signController.signup); //注册
router.post('/login',signController.login);		//登录
router.get('/logout',signController.logout);	//退出登录
router.get('/active_account',signController.activeAccount);//账号激活
router.post('/searchpass',signController.searchPass);//获取重置邮箱
router.post('/resetvalid',signController.resetValid);//验证
router.post('/updatepass',signController.updatePass);//重置密码

/**
 * user
 */
router.get('/user/count',userController.count); //统计注册用户个数

/**
 * git-batch-file-builder项目的路由
 */

router.post('/gitbatch/test',gitBatchCtrl.createGitBatch);

module.exports = router;
