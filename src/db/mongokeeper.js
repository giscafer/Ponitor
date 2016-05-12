/**
 * 数据库连接
 */
'use strict'
const mongoose = require('mongoose');
const util = require("util");
// mongoose.Promise = require('bluebird');
function MongooseKeeper() {
    this.db = mongoose.createConnection();
    this.open_count = 0;
}
//配置接口
MongooseKeeper.prototype.config = function(conf) {
    let opts = {
        db: {
            native_parser: true
        },
        server: {
            poolSize: 5,
            auto_reconnect: true
        },
        user: conf.userid,
        pass: conf.password
    };

    let connStr;
    if (process.env.MONGO_DB_STR) {
        connStr = process.env.MONGO_DB_STR;
    } else {
        //'mongodb://user:pass@localhost:port/database'
        connStr = util.format('mongodb://%s:%s@%s:%d/%s', conf.userid, conf.password, conf.host, conf.port, conf.database);
    }
    mongoose.connect(connStr, function(err) {
        if (err) {
            console.error('connect to %s error: ', connStr+process.env.NODE_ENV, err.message);
            // process.exit(1);
        }
    });
    var dbcon = mongoose.connection;
    //监听关闭事件并重连  
    dbcon.on('disconnected', function() {
        console.log('disconnected');
        dbcon.close();
    });
    dbcon.on('open', function() {
        console.log('connection success open');
        this.recon = true;
    });
    dbcon.on('close', function(err) {
        console.log('closed');
        // dbcon.open(host, dbName, port, opts, function() {  
        // console.log('closed-opening');  
        // });  
        reConnect('*');
    });

    function reConnect(msg) {
        console.log('reConnect' + msg);
        if (this.recon) {
            console.log('reConnect-**');
            dbcon.open(conf.host, conf.database, conf.port, opts, function() {
                console.log('closed-opening');
            });
            this.recon = false;
            console.log('reConnect-***');
        }
        console.log('reConnect-end');
    }
};

exports = module.exports = new MongooseKeeper();
