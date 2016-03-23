/**
 * schedule
 */
'use strict'

const schedule=require('node-schedule');
const GoodModel=require('../models/good');
const Crawler=require('../storeUtils');
const wechat=require('../hook/wechat');

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
					let msg='',
						title=good.name;
					let tmpl='，原价格：'+good.marketPrice+'，现价格：'+goodInfo.marketPrice;
					const status=Number(goodInfo.marketPrice)-Number(good.marketPrice);
					//监测价格是否变化
					if(status!==0){
						console.log(good.name+' price had changed!');
						GoodModel.update(good._id, {
						  oldPrice:good.marketPrice,
						  priceText:'￥'+goodInfo.marketPrice,
						  marketPrice: goodInfo.marketPrice
						})
						.catch(err => reject(err));
						//拼接微信图文信息
						if(status>0){
							title+=' 涨价了';
						}else{
							title+=' 降价了';
						}
						msg=title+tmpl;
						let article={
						   "title":title,
						   "description":msg,
						   "url":good.url,
						   "picurl":good.image
						};
						wechat.sendNews('lhb1020279026',[article],(err,res)=>{
							if(err){
								console.log('微信发送失败'+err);
							}
						});
					}
				});
			}
		}));
	});
}

function cronSchedule(){
	detect().then(() => console.log('detecting finsihed!'));
}
//启动的时候执行一次
cronSchedule();
//每2小时执行监测一次
let j = schedule.scheduleJob('0 * */2 * * *', () => cronSchedule());


module.exports = { detect };
