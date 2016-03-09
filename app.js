var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');

var webRouter=require('./src/routes/web_router');

var app=express();

//view engine
app.set('views',path.join(__dirname,'./src/views'));
app.set('view engine','html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// 静态文件目录
app.use(express.static(__dirname + './src/views'));
app.use('/dist', express.static(__dirname + '/dist'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')));

app.use('/',webRouter);
// app.use('/api',api);
app.listen(8000, function() {
    console.log("Ponitor listening on port %d", 8000);
    console.log("You can debug your app with http://" + '127.0.0.1' + ':' +8000);
});

module.exports = app;