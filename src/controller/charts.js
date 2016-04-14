'use strict'

const goodModel = require('../models/good');
//query good
function showChart(req, res, next) {
    const gid = req.params.gid;
    if (!req.session.user || !gid) {
        return res.send([]);
    }
  	goodModel.getGoodById({_id:gid})
        .then(good => {
            if(good){
            	var options={
            		goodName:good.name,
            		series:good.floatedData
            	};
            	return res.send(options);
            }else{
            	return res.status(404).send({
            		result_code:-1,
            		error:'找不到该商品!'
            	});
            }
        })
        .catch(err => res.send(err));
}


module.exports = { showChart };
