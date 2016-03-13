/**
 * tmall good
 */
'use strict'

const cheerio = require('cheerio');
const request = require('superagent');
//good details
const tmallUrl = 'https://detail.tmall.com/item.htm';
// eg:https://detail.tmall.com/item.htm?id=42323050374;
const priceReqUrl='https://mdskip.taobao.com/core/initItemDetail.htm';

function getPrice(itemId) {
    return new Promise((resolve, reject) => {
        request.get('https://mdskip.taobao.com/core/initItemDetail.htm?itemId=42323050374')
            // .query('itemId', itemId)
            // .query('isAreaSell=false&offlineShop=false&isSecKill=false&cachedTimestamp=1457833001169&isRegionLevel=false&isUseInventoryCenter=false&showShopProm=false')
            // .query('tmallBuySupport=true&progressiveSupport=true&queryMemberRight=true&isForbidBuyItem=false&service3C=false&isApparel=false&household=false&sellerPreview=false')
            // .query('&tryBeforeBuy=false&cartEnable=true&addressLevel=2&callback=setMdskip&timestamp='+new Date().getTime()+'&isg=AktLnHVKqy6FjPBm01DBX7RjW-U14F9i')
            .set('Content-Type', 'application/json')
            .set('referer','https://detail.tmall.com/item.htm?id=42323050374')//+itemId
            .set('user-agent','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.3')
            // .query('isAreaSell=false&offlineShop=false&isSecKill=false&cachedTimestamp=1457833001169&isRegionLevel=false&isUseInventoryCenter=false&tmallBuySupport=true&itemId=42323050374&progressiveSupport=true&queryMemberRight=true&isForbidBuyItem=false&service3C=false&isApparel=false&household=false&showShopProm=false&tryBeforeBuy=false&sellerPreview=false&cartEnable=true&addressLevel=2&callback=setMdskip&timestamp=1457874287532&isg=AktLnHVKqy6FjPBm01DBX7RjW-U14F9i')
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const priceInfo=JSON.parse(res.text);
                    console.log(priceInfo.defaultModel.itemPriceResultDO.priceInfo);
                    //sku对应json里边的键值对，如89489479098"颜色分类:7644-2（黑盘黑皮
                    resolve(priceInfo);
                }
            });
    });
}

function fetchGoodInfo(itemId) {
    return new Promise((resolve, reject) => {
        request.get(tmallUrl)
            .query('id', itemId)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const $ = cheerio.load(res.text);
                    resolve(args);
                }
            });
    });

}

//test
getPrice('42323050374').then((priceInfo)=>{
	// console.log(priceInfo);
}).catch((err)=>{
	console.log(err);
});

module.exports = { getPrice, fetchGoodInfo };
