/**
 * apple app
 */
'use strict'

const cheerio=require('cheerio');
const request=require('superagent');

const url='https://itunes.apple.com/cn/app/garageband/id408709785?mt=8';

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
                            info[key]=text.substring(1)-0;
                            break;
                        default:
                            info[key]=text;
                            break;
                    }
               });
               resolve(info);
           } 
        });
    });
}
fetchAppInfo(url).then((appInfo)=>{
    console.log(appInfo);
}).catch((err)=>{
    console.log(err);
});

module.exports={fetchAppInfo}