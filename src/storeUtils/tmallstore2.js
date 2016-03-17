/**
 * tmall good crawler
 */
'use strict'

const cheerio = require('cheerio');
//阿里的还搞不清楚为什么使用superagent请求时，乱码使用iconv-lite解决不了
const request = require('superagent');
const iconv = require('iconv-lite');
const priceReqUrl = 'https://ald.taobao.com/recommend.htm';
//eg：https://ald.taobao.com/recommend.htm?recommendItemIds=524251757444,27156624072&needCount=16&appID=03130
/**
 * fetch tmall good info
 * @param   {String}   itemId  the good id string
 * eg：'42323050374' or '524251757444,27156624072'
 * @return  {Array<Object>}    [goodInfo]
 */
function fetchGoodInfo(itemId) {
    itemId = '524251757444'; //test
    return new Promise((resolve, reject) => {
        request.get(priceReqUrl + '?needCount=16&appID=03130&recommendItemIds=' + itemId)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const text = iconv.decode(new Buffer(res.text), 'GBK');
                    const resultJson = JSON.parse(text);
                    const resInfo = resultJson.itemList[0];
                    let info = {};
                    info.goodId = resInfo.id;
                    info.name = resInfo.title;
                    info.type = 'tmall';
                    info.image = resInfo.img;
                    info.url = resInfo.url;
                    info.description = resInfo.title;
                    // info.marketPrice=resInfo.marketPrice;
                    info.price = resInfo.price;
                    // console.log(info);
                    resolve(info);
                }
            });
    });
}
// test
// fetchGoodInfo('42323050374').then((goodInfo)=>{
//  console.log(goodInfo);
// }).catch((err)=>{
//  console.log(err);
// });

module.exports = { fetchGoodInfo };
