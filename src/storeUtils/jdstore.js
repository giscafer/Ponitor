/**
 * jd store good
 */
'use strict'

const cheerio = require('cheerio');
const superagent = require('superagent');
const request = require('request');
const iconv=require('iconv-lite');

//http://item.jd.com/bigimage.aspx?id=10053073399
function getPrice(url) {
    const skuidsStr=url.replace('http://item.jd.com/','');
    const len=skuidsStr.indexOf('.htm');
    const skuids=skuidsStr.substring(0,len);
    
    return new Promise((resolve, reject) => {
        superagent
            .get('http://p.3.cn/prices/mgets')//or http://pm.3.cn/prices/pcpmgets
            .query('skuIds=J_' + skuids + '&type=1')
            .end(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                	const priceInfo=eval(res.text)[0];
                	priceInfo.url=url;
                	priceInfo.id=skuids;
                    fetchGoodInfo(priceInfo).then(info=>{
                        resolve(info);
                    }).catch(err=>reject(err));
                }
            });
    });
}

function fetchGoodInfo(obj) {
	const url=obj.url;
	const itemId=obj.id;
    return new Promise((resolve, reject) => {
        let body = [],
            size = 0;
          request.get({
                url: url,
                headers: {

                }
            })
            .on('response', function(response) {
                response.setEncoding = 'utf8';
                response.on('data', function(chunk) {
                    body.push(chunk);
                    size += chunk.length;
                });
            })
            .on('error', function(err) {
                reject(err);
            })
            .on('end', function() {
                const bff = Buffer.concat(body , size);
                const text = iconv.decode(bff, 'GBK');
                let info = {
                    screenshot: []
                };
                console.log(obj);
                try{
                    const $ = cheerio.load(text);
                    const $intro = $('#product-intro');
                   
                    info.name = $intro.find("#name h1").text();
                    info.type = 'jd';
                    info.goodId = itemId;
                    info.url = url;
                    info.description = $intro.find($("#name h1")).text();
                    info.image = 'http:'+$intro.find('#spec-n1 img').attr('src');
 					info.price=obj.p;
 					info.marketPrice=obj.p;
 					info.priceText='￥'+obj.p;
                }catch(e){
                    reject(e);
                }
                resolve(info);
            });
    });
}
// const url = 'http://item.jd.com/1250967.html';
// getPrice(url).then((goodInfo) => {
//    console.log(goodInfo);
// }).catch((err) => {
//     console.log(err);
// });

module.exports = {getPrice};
