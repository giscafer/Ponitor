var bcrypt = require('bcryptjs');
var moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function(date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.validateId = function(str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function(str) {
    return new Promise((resolve,reject)=>{
        bcrypt.hash(str, 10, (err,result)=>{
            if(err){
                reject({
                    result_code:-1,
                    status:500,
                    error:err
                });
            }
            resolve(result);
        });
    });
};

exports.bcompare = function(str, hash, callback) {
    return new Promise((resolve,reject)=>{
        bcrypt.compare(str, hash, (err,result)=>{
            if(err){
               return reject({
                    result_code:-1,
                    status:500,
                    error:err.message
                });
            }
            resolve(result);
        });
    });
};

exports.stringToHex = function(str) {　　　　
    var val = "";　　　　
    for (var i = 0; i < str.length; i++) {　　　　　　
        if (val === "")　　　　　　　　 val = str.charCodeAt(i).toString(16);　　　　　　
        else　　　　　　　　 val += str.charCodeAt(i).toString(16);　　　　 }　　　　
    return val;　　 };
