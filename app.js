'use strict'
var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var mongokeeper = require('./src/models/mongokeeper');
var webRouter=require('./src/routes/web_router');
var apiRouter=require('./src/routes/api_router');
var config=require('./src/config.global');
var authMiddleware=require('./src/common/auth');
var app=express();

//view engine
app.set('views',path.join(__dirname,'./src/views'));
app.set('view engine','html');
app.engine('html', require('ejs-mate'));
// app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// 静态文件目录
app.use(express.static(__dirname + './src/views'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(config.auth_cookie_name));

process.env.NODE_ENV='development';
// process.env.NODE_ENV='production';

if (process.env.NODE_ENV=='development') { 
    process.env.MONGO_DB_STR = config.dev_dbUrl;
}
mongokeeper.config(config.dbConfig);
//开发模式下本地存储session用mongodb，BAE用redis存储session
if (process.env.NODE_ENV=='development') {
    var MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret: config.session_secret,
        key: config.auth_cookie_name, //cookie name
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }, //24 hours
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            url: config.dev_dbUrl
        })
    }));

} else {
    //redis保存session
    var redis = require('redis');
    var RedisStore = require('connect-redis')(session);
    var client = redis.createClient(80, 'redis.duapp.com', {
        "no_ready_check": true
    });
    client.on("error", function(err) {
        console.log("redis client Error " + err);
    });
    // 建立连接后，在进行集合操作前，需要先进行auth验证
    client.auth(config.bae_accesskey + '-' + config.bae_secretkey + '-' + config.redis_db);
    app.use(session({
        secret: config.session_secret,
        key: config.auth_cookie_name,
        store: new RedisStore({
            client: client
        }),
        resave: true,
        saveUninitialized: true
    }));
}
app.use(authMiddleware.authUser);
app.use('/',webRouter);
app.use('/api',apiRouter);
//start detect
require('./src/schedule/detect.js');

app.listen(config.port, function() {
    console.log("Ponitor listening on port %d", config.port);
    console.log("You can debug your app with http://" + config.localhost + ':' +config.port);
});

module.exports = app;