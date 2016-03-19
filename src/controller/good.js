'use strict'

const goodModel = require('../models/good');
const Crawler=require('../storeUtils');
//list goods
function list(req,res,next){
	const type=req.params.type;
	let query={};
	if(type!=='all' && type!=="undefined"){
		query.type=type;
	}
	 goodModel.list(query, {})
        .then(goods => {
            res.send(goods)
        })
        .catch(err => res.send(err));
}
// saving goods
function save(req,res,next){
	const goodUrl = req.body.url;
	Crawler.crawInfo(goodUrl)
	    .then(info => { 
	        goodModel.add(info) .then(good =>{
	         res.send(good);
	        }).catch(err =>{
	         res.send(err);
	        });
	     })
	     .catch(err =>{
	          res.send(err);
	     });
}

module.exports = {list,save};
