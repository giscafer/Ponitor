/**
 * 用户权限控制
 */
'use strict'
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const config = require('../config.global');

/**
 * 需要登录
 */
function userRequired(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.send({
            result_code: -1,
            status: 403,
            reject: 'unlogin',
            error: '您还没有登录！'
        });
    }

    next();
}
/**
 * 需要管理员权限
 */
function adminRequired(req, res, next) {
    if (!req.session.user) {
        return res.status(403).send({
            result_code: -1,
            reject: 'unlogin',
            error: '您还没有登录'
        });
    }

    if (!req.session.user.is_admin) {
        return res.status(403).send({
            result_code: -1,
            reject: 'unadmin',
            error: '需要管理员权限'
        });
    }

    next();
}
/**
 * cookie签名保存
 */
function gen_session(user, res, next) {
    let auth_token = user._id + '$$$$';
    let opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 , //cookie 有效期7天
        signed: true, //如果true,express会使用req.secret来完成签名，需要cookie-parser配合使用
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts);
    next();
}

/**
 * 验证用户是否登录
 */
function authUser(req, res, next) {
    //已经登录
    if (req.session.user) {
        setUser(req.session.user);
    } else {
        //cookie中取出登录信息
        let auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }
        //cookie存在登录信息
        let auth = auth_token.split('$$$$');
        let user_id = auth[0];
        UserModel.getUserByIdAsync(user_id)
        .then(user=>{
            setUser(user);
            return null;
        })
        .catch(err=>{
            return next(err);
        });
    }

   function setUser(user) {
        if (!user) {
            return next();
        }
        user = req.session.user = new UserModel(user);
        if (config.admins.hasOwnProperty(user.loginname)) {
            req.session.user.is_admin = true;//管理员
        }
        next();
    }

   
}

module.exports = { userRequired, adminRequired, gen_session, authUser };
