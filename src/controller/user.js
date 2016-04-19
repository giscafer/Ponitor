/**
 * user控制类
 */
'use strict'
const UserModel = require('../models/user');

function count(req,res,next) {
	UserModel.getCountByQueryAsync({})
	.then(count=>{
		return res.send({
			status:200,
			data:count
		});
	})
	.catch(err=>{
		return res.send({
			result_code:-1,
			status:500,
			error:err.message || '统计用户数出错！'
		});
	});
}

module.exports = { count };
