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
 * 验证昵称是否存在 api接口（ajax请求）
 */
exports.validateName_api_v1 = function(req, res, next) {
    let name = validator.trim(req.params.name);
    UserModel.getUsersByName(name, function(err, users) {
        if (err) {
            return next(err);
        }
        var code = 0,
            msg = '该昵称可以使用';
        if (users.length > 0) {
            code = 1;
            msg = '该昵称已被使用';
        }
        res.send({
            status: code,
            message: msg
        });
    });

};
/**
 * 验证昵称是否存在
 */
exports.validateName = function(req, res, next) {
    let loginname = validator.trim(req.body.loginname);
    UserModel
        .getUserByLoginNameAsync(loginname)
        .then(user => {
            if (user) {
                return res.send({
                    status: 402,
                    message: '该昵称已被使用'
                });
            }
            next();
        })
        .catch(function(err) {
            return next(err);
        });
};
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
    let active = false; //默认用户未激活

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
                return errHandler('用户名或邮箱已被使用');
            }
            //加密密码后保存
            tools.bhash(pass)
                .then(passhash => {
                    UserModel.create({
                        loginname,
                        passhash,
                        email,
                        active
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
                                message: '欢迎加入' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。',
                                referer: '/signin'
                            });
                        }
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

var notJump = [
    '/active_account', //激活页面
    '/reset_pass', //重置密码页面，避免重置两次
    '/signup', //注册页面
    '/search_pass' //search pass page
];
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

    let getUser;
    if (laoUtils.contains(loginname, '@')) {
        getUser = UserModel.getUserByMailAsync;
    } else {
        getUser = UserModel.getUserByLoginNameAsync;
    }
    let errHandler = function(msg) {
        res.status(403).render({
            result_code: -1,
            status: 403,
            error: msg || '用户名或密码错误'
        });
    };
    //用户名是否存在——>存在则验证密码，不存在则返回错误信息
    getUser(loginname)
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
                    if (!user.active) {
                        mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
                        res.status(403);
                        return res.render('sign/signin', {
                            error: '此账号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。'
                        });
                    }
                    //将session保存到cookie中
                    authMiddleWare.gen_session(user, res);
                    var refer = req.session._loginReferer || '/';
                    for (var i = 0, len = notJump.length; i !== len; ++i) {
                        if (laoUtils.contains(refer, notJump[i])) {
                            refer = '/';
                            break;
                        }
                    }
                    res.redirect(refer);
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
exports.signout = function(req, res, next) {
    // console.log('signout');
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.redirect('/');
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
    .then(user=>{
        if (!user) {
            return next(new Error('[ACTIVE_ACCOUNT] no such user:' + name));
        }
        let passhash = user.pass;
        if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
            return res.send({
                result_code:-1,
                status:422,
                error: '信息有误，账号无法被激活。'
            });
        }
        if (user.active) {
            return res.send({
                result_code:-1,
                status:422,
                error: '账号已经是激活状态。'
            });
        }
        user.active = true;
        user.save(err=>{
            if (err) {
                return next(err);
            }
            res.send({
                result_code:0,
                status:200,
                success: '账号已被激活，请登录'
            });
        });
    })
    .catch(err=>{
        return next(err);
    });
    
};
//密码找回页面
exports.showSearchPass = function(req, res) {
    res.render('sign/search_pass');
};
/**
 * 找回密码申请
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.updateSearchPass = function(req, res, next) {
    var email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
        return res.render('sign/search_pass', {
            error: '邮箱不合法',
            email: email
        });
    }
    //动态生成retrieve_key和timestamp到users collection，之后重置密码进行验证
    var retrieveKey = uuid.v4();
    var retrieveTimer = new Date().getTime();

    UserModel.getUserByMail(email, function(err, user) {
        if (err) {
            res.render('sign/search_pass', {
                error: '没有这个电子邮箱。',
                email: email
            });
            return;
        }
        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTimer;
        user.save(function(err) {
            if (err) {
                return next(err);
            }
            //发送重置密码的邮件

            mail.sendResetPassMail(email, retrieveKey, user.loginname);

            res.render('notify/notify', {
                success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'
            });

        });
    });
};
/**
 * 找回密码邮箱链接有效性验证
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.resetPass = function(req, res, next) {

    var key = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    UserModel.getUserByNameAndKey(name, key, function(err, user) {
        if (err) {
            next(err);
        }
        if (!user) {
            res.status(403);
            return res.render('notify/notify', { error: '信息有误，密码无法重置。' });
        }
        var now = new Date().getTime();
        var oneDay = 1000 * 60 * 60 * 24;
        if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
            res.status(403);
            return res.render('notify/notify', { error: '该连接已过期，请重新申请。' });
        }
        return res.render('sign/reset', { name: name, key: key });
    });
};
/**
 * 密码更新保存
 * @param  {HttpRequest}   req 
 * @param  {HttpRequest}   res 
 * @param  {Function} next
 */
exports.updatePass = function(req, res, next) {
    var psw = validator.trim(req.body.psw) || '';
    var repsw = validator.trim(req.body.repsw) || '';
    var key = validator.trim(req.body.key) || '';
    var name = validator.trim(req.body.name) || '';

    var ep = new EventProxy();
    ep.fail(next);

    if (psw !== repsw) {
        return res.render('sign/reset', { name: name, key: key, error: '两次密码输入不一致。' });
    }
    UserModel.getUserByNameAndKey(name, key, ep.done(function(user) {
        if (!user) {
            return res.render('notify/notify', { error: '错误的激活链接' });
        }
        tools.bhash(psw, ep.done(function(passhash) {
            user.pass = passhash;
            //清空重置标志字段
            user.retrieve_key = null;
            user.retrieve_time = null;
            user.active = true; //用户激活

            user.save(function(err) {
                if (err) {
                    return next(err);
                }
                return res.render('notify/notify', { success: '你的密码已重置。' });
            });
        }));
    }));
};
