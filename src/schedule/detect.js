/**
 * schedule
 */
'use strict'

const schedule=require('node-schedule');
const GoodModel=require('../models/good');
const Crawler=require('../storeUtils');

function detect(){
	return new Promise((resolve,reject)=>{
		let count=0;
		GoodModel.list({},{}).then(goods=>goods.map((good,index)=>{
			if(good.url){

				Crawler.crawInfo(good.url).then(goodInfo=>{
					count++;
					console.log('crawler '+good.name+','+count+' of '+goods.length);
					if(count===goods.length){
						resolve();
					}
					//监测价格是否变化
					if(Number(goodInfo.marketPrice)!==Number(good.marketPrice)){
						console.log(good.name+' price had changed!');
						GoodModel.update(good._id, {
						  oldPrice:good.marketPrice,
						  priceText:'￥'+goodInfo.marketPrice,
						  marketPrice: goodInfo.marketPrice
						})
						.catch(err => reject(err));
					}
				});
			}
		}))
	})
}

function cronSchedule(){
	detect().then(() => console.log('detecting finsihed!'));
}
//启动的时候执行一次
cronSchedule();
//每2小时执行监测一次
let j = schedule.scheduleJob('0 * */2 * * *', () => cronSchedule());


module.exports = { detect };
