/**
 * Created by feichenxi on 2015/7/20.
 */

/**
 * 模块依赖
 */
var express = require('express');
var mongodb = require('mongodb');

/**
 * 构建引用程序
 */
var app = express.createServer();

/**
 * 中间件
 */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'my secret' }));

/**
 * 指定视图选项
 */
app.set('view engine', 'jade');
app.set('view options', { layout: false });

/**
 * 默认路由
 */
app.get('/', function(req, res){
    res.render('index', { authenticated: false });
});

/**
 * 默认路由
 */
app.get('/login', function(req, res){
    res.render('login');
});

/**
 * 默认路由
 */
app.get('/signup', function(req, res){
    res.render('signup');
});

/**
 * 监听
 */
app.listen(3000);
