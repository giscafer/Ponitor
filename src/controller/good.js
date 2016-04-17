'use strict'

const goodModel = require('../models/good');
const Crawler=require('../storeUtils');
//list goods
function list(req,res,next){
	const type=req.params.type;
	if(!req.session.user){
		return res.send({
			status:403,
			data:[]
		});
	}
	let query={
		userId:req.session.user._id
	};
	if(type!=='all' && type!=="undefined" && type!==undefined){
		query.type=type;
	}
	 goodModel.list(query, {})
        .then(goods => {
            res.send({
				status:200,
				data:goods
			});
        })
        .catch(err => res.send(err));
}
// saving goods
function save(req,res,next){
	const goodUrl = req.body.url;
	let user=req.session.user;
	Crawler.crawInfo(goodUrl)
	    .then(info => { 
	    	info.userId=user._id;
	        goodModel.add(info).then(good =>{
	         res.send(good);
	        }).catch(err =>{
	         res.send(err);
	        });
	     })
	     .catch(err =>{
	          res.send(err);
	     });
}

function del(req,res,next){
	let goodId=req.params.goodId;
	let userId=req.session.user._id.toString();
	goodModel.getGoodById(goodId)
	.then(good=>{
		if(!good){
			return res.status(404).send({
				result_code:-1,
				error:'此商品不存在！'
			});
		}
		if(good.userId.toString()!==userId){
			return res.status(403).send({
				result_code:-1,
				error:'无法删除此商品！'
			});
		}
		good.remove(function(good){
			res.send({
				result_code:0,
				success:'删除成功！'
			});
		});
	})
	.catch(err=>{
		res.send({
			result_code:-1,
			error:err && err.message
		});
		return next(err);
	});
}

module.exports = {list,save,del};
