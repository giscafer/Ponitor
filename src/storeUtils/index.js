/**
 * 
 */
'use strict'

const tmallCrawler = require('./tmallstore').fetchGoodInfo;
const jdCrawler = require('./jdstore').fetchGoodInfo;
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
// const url = 'https://detail.tmall.com/item.htm?id=42323050374';
// const url = 'http://item.jd.com/1250967.html';
/*const url='https://itunes.apple.com/cn/app/garageband/id408709785?mt=8';
crawInfo(url).then((result)=>{
	console.log(result);
}).catch(err=>console.log(err));*/