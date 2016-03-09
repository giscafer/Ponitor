'use strict'
const express=require('express');
const router=express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Catchem' });
});

module.exports = router;
// export default router;