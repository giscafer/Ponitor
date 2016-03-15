'use strict'
const express = require('express');
const router = express.Router();


const tamllStore = require('../storeUtils/tmallstore');
const goodModel = require('../models/good');

/* good api. */
router.get('/good', (req, res) => {
    goodModel.list({}, {})
        .then(goods => res.send(goods))
        .catch(err => res.send(err));
});

router.post('/good', (req, res) => {
    const goodUrl = req.body.url;
    tamllStore.fetchGoodInfo(goodUrl)
    	.then(info=>goodModel.add(info))
        .then(good => res.send(good))
        .catch(err => res.send(err));
});

module.exports = router;
// export default router;
