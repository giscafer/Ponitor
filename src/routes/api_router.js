'use strict'
const express = require('express');
const router = express.Router();

const goodController = require('../controller/good');
/* good api. */
router.get('/good/:type', goodController.list);

router.post('/good', goodController.save);

module.exports = router;
