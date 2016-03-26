module.exports={
    name:'Ponitor',

	 /**
     * URL
     * 域名地址,如果没有请留空，(!domain || devMode)===true时会读取host+':'+port作为地址
     */
    domain: 'ponitor.duapp.com', //上线域名
    localhost: '127.0.0.1', //本地部署
    port: 18080, //本地部署
    // mongodb 配置
    dev_dbUrl: 'mongodb://127.0.0.1/ponitor',
    //process.env.NODE_ENV=='development' 则数据库连接使用dev_dbUrl，反之为dbConfig
    dbConfig: {
        "host": "mongo.duapp.com",
        "database": "********",
        "userid": "a82c2085536e4175bff285ba********",
        "password": "e4db12d663f54c1a87a8893********",
        "port": 8908
    },
    //session设置
    session_secret: 'ponitor_secret', // session密匙
    session_collection: 'ponitor_collect', // 存放session的collection
    cookie_secret: 'ponitor_cookie_secret', // session密匙
    auth_cookie_name: 'ponitor_cookie', //cookie名称

    // redis 配置，BAE
    //百度应用的	用户名和密码
    bae_accesskey:'hehehe',
    bae_secretkey:'hehehe',
    
    redis_host: 'redis.duapp.com',
    redis_port: 80,
    redis_db: 'ywBsVflljSOlNw********',
    need_active_mail:false,
    // 邮箱配置 need_active_mail为true时，必须设置
    mail_opts: {
        debug:true,
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'gisbbs@126.com',
            pass: '111111111'
        }
    },
    admins:{}
};