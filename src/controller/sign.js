'use strict'

const UserModel = require('../models/user');
const mail = require('../common/mail');
const tools = require('../common/tools');
const authMiddleWare = require('../common/auth');
const config = require('../config.global');
const validator = require('validator');
const utility = require('utility');
const uuid = require('node-uuid');
const laoUtils = require('lao-utils');


/**
 * 注册入口
 * @param  {HttpRequest}   req  
 * @param  {HttpRequest}   res  
 * @param  {Function} next
 */
exports.signup = function(req, res, next) {
    let name = validator.trim(req.body.loginname).toLowerCase();
    let loginname = validator.trim(req.body.loginname).toLowerCase();
    let email = validator.trim(req.body.email).toLowerCase();
    let pass = validator.trim(req.body.pass);
    let rePass = validator.trim(req.body.re_pass);
    let active = false;
    if (!config.need_active_mail) { //如果不需要验证邮箱，默认激活
        active = true;
    }

    let errHandler = function(msg) {
        res.status(422).send({
            result_code: -1,
            error: msg,
            name: name,
            loginname: loginname,
            email: email
        });
    };
    //START验证信息的正确性
    if ([name, loginname, pass, rePass, email].some(function(item) {
            return item === '';
        })) {
        return errHandler('信息不完整!');
    }
    if (loginname.length < 5 || loginname.length > 12) {
        return errHandler('用户名要求5~12个字符');
    }
    if (!tools.validateId(loginname)) {
        return errHandler('用户名不合法');
    }
    if (!validator.isEmail(email)) {
        return errHandler('邮箱不合法');
    }
    if (pass !== rePass) {
        return errHandler('两次密码输入不一致');
    }
    //END
    //验证数据库是否有重复用户和邮箱
    let query = {
        '$or': [{
            'loginname': loginname
        }, {
            'email': email
        }]
    };
    let opt = {};

    UserModel.getUsersByQueryAsync(query, opt)
        .then(users => {
            if (users.length > 0) {
                errHandler('用户名或邮箱已被使用');
                return null;
            }
            //加密密码后保存
            tools.bhash(pass)
                .then(passhash => {
                    UserModel.create({
                        loginname: loginname,
                        pass: passhash,
                        email: email,
                        active: active
                    }).then(user => {
                        //发送激活邮件
                        if (!config.need_active_mail) {
                            res.send({
                                result_code: 0,
                                success: '注册成功，欢迎加入' + config.name + '！',
                                referer: '/signin'
                            });
                        } else {
                            mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
                            res.send({
                                result_code: 0,
                                success: '欢迎加入' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。',
                                referer: '/signin'
                            });
                        }
                        return null;
                    }).catch(err => {
                        return next(err);
                    });
                })
                .catch(err => {
                    return next(err);
                });
        })
        .catch(err => {
            return next(err);
        });

};

/**
 * Handler user login
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function(req, res, next) {
    let loginname = validator.trim(req.body.loginname).toLowerCase();
    let pass = validator.trim(req.body.pass);

    if (!loginname || !pass) {
        res.status(422);
        return res.send({
            result_code: -1,
            status: 422,
            error: '信息不完整'
        });
    }

    if (laoUtils.contains(loginname, '@')) {
        //避免static里边的this发生转变
        UserModel.getUser = UserModel.getUserByMailAsync;
    } else {
        UserModel.getUser = UserModel.getUserByLoginNameAsync;
    }
    let errHandler = function() {
        res.status(403).send({
            result_code: -1,
            status: 403,
            error: '用户名或密码错误'
        });
    };
    //用户名是否存在——>存在则验证密码，不存在则返回错误信息
    UserModel.getUser(loginname)
        .then(user => {
            if (!user) {
                return errHandler();
            }
            //密码是否正确
            let passhash = user.pass;
            tools.bcompare(pass, passhash)
                .then(match => {
                    if (!match) {
                        return errHandler();
                    }
                    //用户未激活的话（如果用户使用的是手机注册的模式，该过程不需要）
                    if (!user.active && config.need_active_mail) {
                        mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
                        return res.status(403).send({
                            result_code: -1,
                            status: 403,
                            error: '此账号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收并激活。'
                        });
                    }
                    //将session保存到cookie中
                    authMiddleWare.gen_session(user, res, next);
                   
                    res.send({
                        userInfo: user,
                        result_code: 0,
                        status: 200,
                        refer: '/',
                        success: '登录成功！'
                    });
                })
                .catch(err => {
                    return res.send(err);
                });
        })
        .catch(err => {
            return next(err);
        });

};
//登出
exports.logout = function(req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.send({
        result_code: 0,
        refer: '/'
    });
};
/**
 * 通过邮箱链接激活账号
 * @param  {HttpRequest}   req  
 * @param  {[HttpResponse]}   res  
 * @param  {Function} next 
 */
exports.activeAccount = function(req, res, next) {
    let key = validator.trim(req.query.key);
    let name = validator.trim(req.query.name);
    UserModel.getUserByLoginNameAsync(name)
        .then(user => {
            if (!user) {
                // return next(new Error('[ACTIVE_ACCOUNT] no such user:' + name));
                res.redirect('/#!/active?type=danger');
                next();
                return null;
            }
            let passhash = user.pass;
            if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {

                return res.redirect('/#!/active?type=danger');
            }
            if (user.active) {

                return res.redirect('/#!/active?type=warning');
            }
            user.active = true;
            user.save(err => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/#!/active?type=info');
            });
        })
        .catch(err => {
            return next(err);
        });

};

/**
 * 找回密码申请
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.searchPass = function(req, res, next) {
    let email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
         return res.send({
             result_code:-1,
             type:'warning',
             referer:'searchpass',
             error:'邮箱格式不正确！',
             email:email
         });
    }
    //动态生成retrieve_key和timestamp到users collection，之后重置密码进行验证
    let retrieveKey = uuid.v4();
    let retrieveTimer = new Date().getTime();

    UserModel.getUserByMailAsync(email).then(user=> {
      
        if(!user){
            return res.send({
                result_code:-1,
                referer:'searchpass',
                email:email,
                error:'没有这个电子邮箱！'
            });
        }
        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTimer;
        user.save(function(err) {
            if (err) {
                return next(err);
            }
            //发送重置密码的邮件

            mail.sendResetPassMail(email, retrieveKey, user.loginname);
            return res.send({
                result_code:0,
                referer:'searchpass',
                success:'我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码！'
            });

        });
    }).catch(err=>{
        return res.send({
            result_code:-1,
            referer:'searchpass',
            email:email,
            error:err && (err.message || err)
        });
    });
};
/**
 * 找回密码邮箱链接有效性验证
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.resetValid = function(req, res, next) {

    let key = validator.trim(req.body.key);
    let name = validator.trim(req.body.name);

    UserModel.getUserByNameAndKeyAsync(name, key)
        .then(user => {
            if (!user) {
                return res.redirect('/#!/message');
            }
            let now = new Date().getTime();
            let oneDay = 1000 * 60 * 60 * 24;
            if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
                return res.redirect('/#!/message');
            }
            res.send('/#!/resetpass');
            return null;
        })
        .catch(err=>{
            return next(err);
        });
};
/**
 * 密码更新保存
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.updatePass=function(req,res,next){
    var psw=validator.trim(req.body.pass) || '';
    var repsw=validator.trim(req.body.repass) || '';
    var key=validator.trim(req.body.key) || '';
    var name=validator.trim(req.body.name)  || '';

    if(psw!==repsw){
        return res.send({
            result_code:-1,
            name:name,
            key:key,
            error:'两次密码输入不一致。'
        });
    }
    UserModel.getUserByNameAndKeyAsync(name,key)
    .then(user=>{
        if(!user){
            return res.send({
               result_code:-1,
               error:'错误的激活链接'
            });
        }
        tools.bhash(psw)
        .then(passhash=>{
            user.pass=passhash;
            //清空重置标志字段
            user.retrieve_key=null;
            user.retrieve_time=null;
            user.active=true;//用户激活

            user.save(function(err){
                if(err){
                    return next(err);
                }
                return res.send({
                    result_code:0,
                    success:'你的密码已重置。'
                });
            });
        }).catch(err=>{
            res.send({
                result_code:-1,
                error:err && (err.message || err)
            });
        })
    })
    .catch(err=>{
        res.send({
            result_code:-1,
            error:err && (err.message || err)
        });
    });
};