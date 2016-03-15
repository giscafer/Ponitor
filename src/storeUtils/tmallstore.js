/**
 * tmall good crawler
 */
'use strict'

const cheerio = require('cheerio');
const request = require('superagent');
// const tmallUrl = 'https://detail.tmall.com/item.htm';
// eg:https://detail.tmall.com/item.htm?id=42323050374;
const priceReqUrl='https://ald.taobao.com/recommend.htm';
//eg：https://ald.taobao.com/recommend.htm?recommendItemIds=524251757444,27156624072&needCount=16&appID=03130
/**
 * fetch tmall good info
 * @param   {String}   itemId  the good id string
 * eg：'42323050374' or '524251757444,27156624072'
 * @return  {Array<Object>}    [goodInfo]
 */
function fetchGoodInfo(itemId) {
    itemId='42323050374';//test
    return new Promise((resolve, reject) => {
        request.get(priceReqUrl+'?needCount=16&appID=03130&recommendItemIds='+itemId)
            .set('user-agent','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.3')
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const resultJson=JSON.parse(res.text);
                    const resInfo=resultJson.itemList[0];
                    let info={};
                    info.skuId=resInfo.id;
                    info.name=resInfo.title;
                    info.type='tmall';
                    info.image=resInfo.img;
                    info.url=resInfo.url;
                    info.description=resInfo.title;
                    info.marketPrice=resInfo.marketPrice;
                    info.oldPrice=resInfo.price;
                    resolve(info);
                }
            });
    });
}
//test
/*fetchGoodInfo('42323050374').then((goodInfo)=>{
	console.log(goodInfo);
}).catch((err)=>{
	console.log(err);
});*/

module.exports = { fetchGoodInfo };
