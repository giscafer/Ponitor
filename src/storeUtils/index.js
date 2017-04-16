/**
 * 
 */
'use strict'

const tmallCrawler = require('./tmallstore').fetchGoodInfo;
const jdCrawler = require('./jdstore').getPrice;
const appleCrawler = require('./applestore').fetchAppInfo;
const urlParser = require('./utils').urlParser;

function crawInfo(url) {
    return new Promise((resolve, reject) => {
        urlParser(url).then(result => {
        	// console.log(result);
            if (result.target === 'alibaba') {
                tmallCrawler(result.itemId).then(info => resolve(info)).catch(err => reject(err));
            } else if (result.target === 'jd') {
                jdCrawler(result.itemId).then(info => resolve(info)).catch(err => reject(err));
            } else if (result.target === 'apple') {
                appleCrawler(result.itemId).then(info => resolve(info)).catch(err => reject(err));
            }
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = { crawInfo };

//test
// const url = 'https://detail.tmall.com/item.htm?abtest=_AB-LR129-PR129&pvid=1351e451-efcf-4833-8a82-71cb1930f0ba&pos=1&abbucket=_AB-M129_B3&acm=03130.1003.1.701602&id=39954179527&scm=1007.12929.25829.100200300000000';
// const url = 'https://detail.tmall.com/item.htm?id=43063021844&spm=a223v.7835278.t0.1.r8mM10&pvid=8a52ad33-fe81-4e43-8e41-6a8ffe96c3a8&scm=1007.12144.80320.9011_8949&sku_properties=10537981:30187193';
// const url = 'https://detail.tmall.com/item.htm?id=42323050374';
// const url = 'https://detail.tmall.com/item.htm?id=42323050374';
// const url = 'http://item.jd.com/1250967.html';
// const url = 'http://item.jd.com/1250967.html';
// const url='https://itunes.apple.com/cn/app/garageband/id408709785?mt=8';
// crawInfo(url).then((result)=>{
// 	console.log(result);
// }).catch(err=>console.log(err));