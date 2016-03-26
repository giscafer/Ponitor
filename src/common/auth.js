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
            message: '您还没有登录！'
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
            error: '您还没有登录'
        });
    }

    if (!req.session.user.is_admin) {
        return res.status(403).send({
            result_code: -1,
            error: '需要管理员权限'
        });
    }

    next();
}

function gen_session(user, res, next) {
    let auth_token = user._id + '$$$$';
    let opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 , //cookie 有效期7天
        signed: true, //如果true,express会使用req.secret来完成签名，需要cookie-parser配合使用
        httpOnly: true
    };
    console.log(auth_token)
    res.cookie(config.auth_cookie_name, auth_token, opts);
    next();
};


/**
 * 验证用户是否登录
 */
function authUser(req, res, next) {
    if (req.session.user) {
        resolve(req.session.user);
    } else {
        //cookie中取出登录信息
        let auth_token = req.signedCookies[config.auth_cookie_name];
         console.log(auth_token)
        if (!auth_token) {
            return next();
        }
        let auth = auth_token.split('$$$$');
        let user_id = auth[0];
        UserModel.getUserByIdAsync(user_id)
        .then(user=>{
            resolve(user);
        })
        .catch(err=>{
            return next(err);
        });
    }

    if (config.debug && req.cookies['mock_user']) {
        let mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = new UserModel(mockUser);
        if (mockUser.is_admin) {
            req.session.user.is_admin = true;
        }
        return next();
    }

   function resolve(user) {
        if (!user) {
            return next();
        }
        user = req.session.user = new UserModel(user);
        if (config.admins.hasOwnProperty(user.loginname)) {
            user.is_admin = true;
        }
        next();
    }

   
}



module.exports = { userRequired, adminRequired, gen_session, authUser };
