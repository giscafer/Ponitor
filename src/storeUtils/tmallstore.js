/**
 * tmall crawler
 */
'use strict'

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');
// eg:https://detail.tmall.com/item.htm?id=42323050374;
const priceReqUrl = 'https://ald.taobao.com/recommend.htm';
//eg：https://ald.taobao.com/recommend.htm?recommendItemIds=524251757444,27156624072&needCount=16&appID=03130
/**
 * fetch tmall&taobao good's info
 * @param   {String}   itemId  the good id string
 * eg：'42323050374' or '524251757444,27156624072'
 * @return  {Array<Object>}    [goodInfo]
 */
function fetchGoodInfo(itemId) {
    return new Promise((resolve, reject) => {
        let body = [],
            size = 0;
        if(!itemId){
            reject({
                status:404,
                message:'商品ID获取失败，请填写正确的地址！'
            });
            return;
        }
        request.get({
                url: priceReqUrl + '?needCount=16&appID=03130&recommendItemIds=' + itemId,
                headers: {
                    "refer":"https://detail.tmall.com/item.htm",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
                }
            })
            .on('response', function(response) {
                //   res.set(response.headers);
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
                const resultJson = JSON.parse(text);
                if(!resultJson.itemList){
                    reject({
                        result_code:-1,
                        status:404,
                        error:'获取商品信息失败！'
                    });
                       return;
                }
                const resInfo = resultJson.itemList[0];
                if(!resInfo){
                    reject({
                        result_code:-1,
                        status:404,
                        error:'获取商品信息失败！'
                    });
                       return;
                }
                let info = {};

                //如果itemId和获取到的goodId不一样，则为下架商品，天猫防爬虫机制
                if(itemId!==resInfo.id){
                    reject({
                        result_code:-1,
                        status:404,
                        error:'该商品已经下架，无法添加！'
                    });
                    return;
                }

                try{
                    info.goodId = resInfo.id;
                    info.name = resInfo.title;
                    info.type = 'alibaba';
                    info.image = resInfo.img;
                    info.url = resInfo.url;
                    info.description = resInfo.title;
                    info.price = resInfo.price;
                    info.marketPrice = resInfo.price;
                    info.priceText='￥'+resInfo.price;
                }catch(e){
                    reject({
                        result_code:-1,
                        status:501,
                        error:e
                    });
                   return;
                }
                resolve(info);
            });

    });
}


module.exports = { fetchGoodInfo };
