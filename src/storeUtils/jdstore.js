/**
 * jd store good
 */
'use strict'

const cheerio = require('cheerio');
const superagent = require('superagent');
const request = require('request');
const iconv = require('iconv-lite');

   //http://p.3.cn/prices/mgets?type=1&area=1&pdtk=&pduid=616834213&pdpin=&pdbp=0&skuIds=J_10053073399
function getPrice(url) {
    const skuidsStr = url.replace('http://item.jd.com/', '');
    const len = skuidsStr.indexOf('.htm');
    const skuids = skuidsStr.substring(0, len);
 
    return new Promise((resolve, reject) => {
        superagent
            .get('http://p.3.cn/prices/mgets') //or http://pm.3.cn/prices/pcpmgets
            .query('skuIds=J_' + skuids + '&type=1&area=1&pdtk=&pdpin=&pdbp=0')
            .end(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    const priceInfo = eval(res.text)[0];
                    priceInfo.url = url;
                    priceInfo.id = skuids;
                    fetchGoodInfo(priceInfo).then(info => {
                      return  resolve(info);
                    }).catch(err => reject(err));
                }
            });
    });
}

function fetchGoodInfo(obj,callback) {

    const itemId = obj.id;
    let url=obj.url;
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
                const bff = Buffer.concat(body, size);
                const text = iconv.decode(bff, 'GBK');
                let info = {
                    screenshot: []
                };
                try {
                    const $ = cheerio.load(text);
                    const $intro = $('.itemInfo-wrap');
                    const $preview = $('#preview');
                    const $itemInfo = $('#itemInfo');
                    if($intro.find('.itemover-tip').length>0){
                      return  reject({
                            status:404,
                            message:'商品已经下架，无法添加'    
                        });
                    }
                    info.description = info.name = $intro.find(".sku-name").text() || $itemInfo.find('#name >h1').text();
                    let $img=$preview.find("#spec-n1 >img");
                    console.log($itemInfo.find('div#name').html())
                    info.image =  $img.attr('data-origin') ||  $img.attr('jqimg') ||  $img.attr('src');
                    info.type = 'jd';
                    info.goodId = itemId;
                    info.url = url;
                    info.price = obj.p;//$intro.find("span.p-price").text();
                    info.marketPrice = obj.p;
                    info.priceText = '￥' +obj.p ;
                } catch (e) {
                    reject(e);
                }
                // console.log(info)
                resolve(info);
            });
    });
}

module.exports = { getPrice };
