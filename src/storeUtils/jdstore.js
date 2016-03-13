/**
 * jd store good
 */
'use strict'

const cheerio = require('cheerio');
const request = require('superagent');

// const url = 'http://item.jd.com/1250967.html';

//http://item.jd.com/bigimage.aspx?id=10053073399
function getPrice(url) {
    const skuidsStr=url.replace('http://item.jd.com/','');
    const len=skuidsStr.indexOf('.');
    const skuids=skuidsStr.substring(0,len);

    return new Promise((resolve, reject) => {
        request
            .get('http://p.3.cn/prices/mgets')//or http://pm.3.cn/prices/pcpmgets
            .query('skuIds=J_' + skuids + '&type=1')
            .end(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                	const priceInfo=eval(res.text)[0];
                	priceInfo.url=url;
                	console.log(priceInfo)
                    resolve(priceInfo);
                }
            });
    });
}
/*function getImage(skuids){
	return new Promise((resolve,reject)=>{
		request.get('http://item.jd.com/bigimage.aspx')
			.query('id',skuids)
			.end(function(err,res){
				if(err){
					reject(err);
				}else{
					const $=cheerio.load(res.text);
					const html=$('ul.list-h').html();
					const ahtml=$('title');
					const imghtml=$('#biger img').attr('src');
					const img=$('img').attr('alt');
					console.log(ahtml.html())
					console.log(imghtml)
					console.log(img)
					resolve(ahtml.html());
				}
			});
	});
}*/
function fetchGoodInfo(obj) {
	const url=obj.url;
    return new Promise((resolve, reject) => {
        request.get(url)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const $ = cheerio.load(res.text, { decodeEntities: true });
                    const $intro = $('#product-intro');
                    const info = {
                        screenshot: []
                    };
                    info.name = $intro.find("#name h1").text();

                    info.description = $intro.find($("#name h1")).text();
                    info.image = 'http:'+$intro.find('#spec-n1 img').attr('src');
                  /*  const $screenshot = $intro.find($('div.spec-items>ul.lh li'));
                    $screenshot.each(function(index, el) {
                        var src = $(el).prop('src');
                        console.log(src)
                        src='http://'+src.replace('n5','n1');
                        info.screenshot.push(src);
                    });*/
 					info.price=obj.p;
 					info.priceText='￥'+obj.p;
                    resolve(info);
                }
            });
    });
}

/*getPrice(url).then((priceInfo) => {
    fetchGoodInfo(priceInfo).then((goodInfo)=>{
    	console.log(goodInfo);
    });
}).catch((err) => {
    console.log(err);
});*/

module.exports = {getPrice,fetchGoodInfo };
