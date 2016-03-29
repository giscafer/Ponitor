'use strict'

const mailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config.global');
const util = require('util');
const logger = require('./logger');
const transport = mailer.createTransport(smtpTransport(config.mail_opts));
//域名domain没有的时留空，devMode下读取host
const SITE_ROOT_URL = 'http://' + (process.env.NODE_ENV === 'development' ? (config.localhost + ":" + config.port) : config.domain);

/**
 * 邮件发送
 * @param {Object} data 邮件对象
 */
function sendMail(data) {
        transport.sendMail(data, function(err) {
        if (err) {
            // 写为日志
            logger.error(err);
        }
    });
}

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
function sendActiveMail(who, token, name) {
    var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    var to = who;
    var subject = config.name + '帐号激活';
    var html = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
        '<p>若您没有在' + config.name + '填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + ' 谨上。</p>';
    //need_active_mail=false不发送邮件
    if (!config.need_active_mail) {
        return;
    }
    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
}

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
function sendResetPassMail(who, token, name) {
    var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    var to = who;
    var subject = config.name + '密码重置';
    var html = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
        '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
        '<p>若您没有在' + config.name + '填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + ' 谨上。</p>';

    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
}

module.exports={ sendMail,sendActiveMail,sendResetPassMail };