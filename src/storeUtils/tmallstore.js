/**
 * tmall crawler
 */
'use strict'

const cheerio = require('cheerio');
//还搞不清楚为什么使用superagent请求阿里的乱码使用iconv-lite解决不了，这里用了原生的request
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
        var body = [],
            size = 0;
        request.get({
                url: priceReqUrl + '?needCount=16&appID=03130&recommendItemIds=' + itemId,
                headers: {

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
                const resInfo = resultJson.itemList[0];
                let info = {};
                info.goodId = resInfo.id;
                info.name = resInfo.title;
                info.type = 'tmall';
                info.image = resInfo.img;
                info.url = resInfo.url;
                info.description = resInfo.title;
                info.price = resInfo.price;
                info.priceText='￥'+resInfo.price;
                resolve(info);
            });

    });
}
//test
// fetchGoodInfo('42323050374').then((goodInfo)=>{
//  console.log(goodInfo);
// }).catch((err)=>{
//  console.log(err);
// });

module.exports = { fetchGoodInfo };
