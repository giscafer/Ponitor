var redis = require('redis');
var session=require('express-session');
var RedisStore = require('connect-redis')(session);
var config=require('../config.global');
var _app=null;
var client = redis.createClient(config.redis_port, 'redis.duapp.com', {
    "no_ready_check": true
});
client.on("error", function(err) {
    console.log("redis client Error " + err);
    console.log("reconnecting~~~~~~~");
    client=redis.createClient(config.redis_port, 'redis.duapp.com', {
	    "no_ready_check": true
	});
    initSession(_app);
});
// 建立连接后，在进行集合操作前，需要先进行auth验证
client.auth(config.bae_accesskey + '-' + config.bae_secretkey + '-' + config.redis_db);
function initSession(app) {
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

module.exports = function(app){
    if(_app===null){
        _app=app;
    }
    initSession(app);
};