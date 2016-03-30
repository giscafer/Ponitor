/**
 * schedule timer
 */
'use strict'
const schedule = require('node-schedule');
const GoodModel = require('../models/good');
const UserModel = require('../models/user');
const Crawler = require('../storeUtils');
const Mail = require('../common/mail');
const _ = require('lodash');
const util = require('util');
const laoUtils = require('lao-utils');
const config = require('../config.global');
const mailFrom = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
const SITE_ROOT_URL = 'http://' + (process.env.NODE_ENV === 'development' ? (config.localhost + ":" + config.port) : config.domain);
let htmlData = [];

function detect() {
    let count = 0;
    UserModel.fetch()
        .then(users => {
            _.map(users, function(user) {
                detectByUserId(user);
            });
        })
        .catch(err => {
            console.log(err);
        });
}

function detectByUserId(user) {
    let userId = user._id,
        email = user.email,
        loginname = user.loginname;

    if (!laoUtils.isExpect(userId)) {
        return;
    }

    GoodModel.list({ userId: userId }, {}).then(goods => {
        htmlData = [];
        _.map(goods, (good, index) => {
            if (good && good.url) {
                Crawler.crawInfo(good.url).then(goodInfo => {
                        console.log('crawlering ' + good.name+'---- of '+loginname);

                        let msg = '',
                            title = good.name,
                            tmpl = '，原价格：' + good.marketPrice + '，现价格：' + goodInfo.marketPrice;
                        const status = Number(goodInfo.marketPrice) - Number(good.marketPrice);
                        //监测价格是否变化
                        if (status !== 0) {
                            console.log(good.name + ' price had changed!');
                            GoodModel.update(good._id, {
                                    oldPrice: good.marketPrice,
                                    priceText: '￥' + goodInfo.marketPrice,
                                    marketPrice: goodInfo.marketPrice
                                })
                                .catch(err => reject(err));
                            //拼接邮件信息
                            if (status > 0) {
                                title += ' 涨价了';
                            } else {
                                title += ' 降价了';
                            }
                            msg = title + tmpl;
                            let article = {
                                "loginname": loginname,
                                "title": title,
                                "description": msg,
                                "url": good.url,
                                "picurl": good.image
                            };
                            htmlData.push(concatHtml(article));
                            if (htmlData.length > 0) {
                                Mail.sendMail({
                                    from: mailFrom,
                                    to: email,
                                    subject: '[' + config.name + ']' + article.title.substring(0, 50),
                                    html: htmlData.join('')
                                });
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });

    });
}
/**
 * 邮件内容（添加图片会被拦截）
 */
function concatHtml(article) {
    let html = '<p>亲爱的用户 ' + article.loginname + '，您好：</p>' +
        '<p>您关注的商品 ' + article.description + '</p>' +
        '<a href  = "' + article.url + '" style="color:blue">详情链接</a>' +
        // '<img src="'+article.image+'"><img><br><br>'+
        '<hr><p>若您没有在<a href  = "' + SITE_ROOT_URL + '">' + config.name + '</a>网站上关注过商品，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + ' 谨上。</p>';
    return html;
}

function cronSchedule() {
    detect();
}
//启动的时候执行一次
// cronSchedule();
//每2小时执行监测一次
let j = schedule.scheduleJob('0 */2 * * *', () => cronSchedule());

module.exports = { detect };
