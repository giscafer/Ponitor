'use strict'
const bcrypt = require('bcryptjs');
const moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
function formatDate(date, friendly) {
    date = moment(date);
    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

}

function validateId(str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
}

function bhash(str) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(str, 10, (err, result) => {
            if (err) {
                reject({
                    result_code: -1,
                    status: 500,
                    error: err
                });
            }
            resolve(result);
        });
    });
}

function bcompare(str, hash, callback) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(str, hash, (err, result) => {
            if (err) {
                return reject({
                    result_code: -1,
                    status: 500,
                    error: err.message
                });
            }
            resolve(result);
        });
    });
}

function stringToHex(str) {　　　　
    let value = "";　　　　
    for (var i = 0; i < str.length; i++) {　　　　　　
        if (value === "") {
            value = str.charCodeAt(i).toString(16);　　
        }　　　　　　　　　　　　
        else {　　　　　　　　
            value += str.charCodeAt(i).toString(16);　
        }　　　
    }　　　　
    return value;　　
}

module.exports = { stringToHex, bcompare, bhash, validateId, formatDate }
