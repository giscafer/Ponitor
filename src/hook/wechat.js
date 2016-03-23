'use strict'

const fs=require('fs');
const path=require('path');
const WechatAPI = require('wechat-api');
//个人私密的微信公众号AppId和AppSecret信息
const appInfo=require('./appid.json');
const cache=require('../common/cache');
const devMode=process.env.NODE_ENV==='development'?true:false;
const filePath=path.resolve(__dirname, '../', 'access_token.txt');


const api = new WechatAPI(appInfo.AppID, appInfo.AppSecret, function(callback) {
	// 传入一个获取全局token的方法
	// 开发模式写文件
	if(devMode){
		fs.readFile(filePath, 'utf8', function (err, txt) {
		    if (err) {return callback(err);}
		    callback(null, JSON.parse(txt));
		  });
	}else{
		cache.get('wechat_access_token', function(err, data) {
	        if (err) {
	            return callback(err);
	        }
	        callback(null, data);
	    });
	}
    
}, function(token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    if(devMode){
    	fs.writeFile(filePath, JSON.stringify(token), callback);
    }else{
    	cache.set('wechat_access_token',token,null,callback);
    }
    
  
});

const api1= new WechatAPI(appInfo.AppID, appInfo.AppSecret);

module.exports = api1;