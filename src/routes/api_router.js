'use strict'
const express = require('express');
const router = express.Router();

const goodController = require('../controller/good');
const signController = require('../controller/sign');

/* good api. */
router.get('/good/:type', goodController.list);

router.post('/good', goodController.save);

/**
 * signup
 */
router.post('/signup',signController.signup);

module.exports = router;
