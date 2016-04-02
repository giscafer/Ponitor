/**
 * apple app
 */
'use strict'

const cheerio=require('cheerio');
const request=require('superagent');

function fetchAppInfo(url){
    return new Promise((resolve,reject)=>{
        request.get(url).end((err,res)=>{
           if(err){
               reject(err);
           }else{
               const $=cheerio.load(res.text);
               const itemProps=$('*[itemprop]');
               
               const info={
                   name:[],
                   screenshot:[]
               };
               itemProps.each((index,item)=>{
                   const $item=$(item);
                    const  key= $item.prop('itemprop');
                    const src= $item.prop('content') || $item.prop('src');
                    const text=$item.text();
                    
                    switch(key){
                        case 'name':
                            info[key].push(text);
                            break;
                        case 'image':
                            info[key]=src;
                            break;
                        case 'description':
                            info[key]=text;
                            break;
                        case 'screenshot':
                            info[key].push(src);
                            break;
                        case 'price':
                            info[key+'Text']=text;
                            info[key]=text.substring(1).replace(/,/g,'')-0;
                            break;
                        default:
                            info[key]=text;
                            break;
                    }
               });
                let appinfo = {};
                appinfo.goodId = getId(url);
                appinfo.name = info.name[0];
                appinfo.type = 'apple';
                appinfo.image = info.image;
                appinfo.screenshot = info.screenshot;
                appinfo.url = url;
                appinfo.description = info.description;
                appinfo.price = info.price;
                appinfo.marketPrice = info.price;
                appinfo.priceText=info.priceText;
               resolve(appinfo);
           } 
        });
    });
}

function getId(url){
    if(!url) return "";
    const start=url.indexOf('/id')+3;
    const end=url.indexOf('?');
    const id=url.substring(start,end)
    return id;
}

module.exports={fetchAppInfo};

