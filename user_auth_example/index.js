/**
 * Created by feichenxi on 2015/7/20.
 */

/**
 * 模块依赖
 */
var express = require('express');
var mongodb = require('mongodb');

/**
 * 构建应用程序
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
 * 身份验证中间件
 */
app.use(function(req, res, next){
    if(req.session.loggedIn){
        res.local('authenticated', true);
        app.users.findOne({_id: mongodb.ObjectID.createFromHexString(req.session.loggedIn)}, function(err, doc){
            if(err) return next(err);
            res.local('me', doc);
            next();
        });
    }else{
        res.local('authenticated', false);
        next();
    }
});

/**
 * 默认路由
 */
app.get('/', function(req, res){
    res.render('index');
});

/**
 * 登陆路由
 */
app.get('/login/:signupEmail?', function(req, res){
    res.render('login', { signupEmail: req.params.signupEmail });
});

/**
 * 登录处理路由
 */
app.post('/login', function(req, res){
    app.users.findOne({ email: req.body.user.email, password: req.body.user.password }, function(err, doc){
        if(err) return next(err);
        if(!doc) return res.send('<p>User not found. Go back and try again</p>');
        req.session.loggedIn = doc._id.toString();
        res.redirect('/');
    });
});

/**
 * 注册路由
 */
app.get('/signup', function(req, res){
    res.render('signup');
});

/**
 * 处理注册路由
 */
app.post('/signup', function(req, res, next){
    console.log(req.body);
    app.users.insert(req.body.user, function(err, doc){
        if(err) return next(err);
        res.redirect('/login/' + doc[0].email);
    });
});

/**
 * 登出路由
 */
app.get('/logout', function(req, res){
    req.session.loggedIn = null;
    res.redirect('/');
});

/***
 * 连接数据库
 */
var server = new mongodb.Server('127.0.0.1', 27017);
new mongodb.Db('my-website', server).open(function(err, client){
    if(err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');
    app.users = new mongodb.Collection(client, 'users');

    /**
     * 保证在查询前建立索引
     */
    client.ensureIndex('users', 'email', function(err){
       if(err) throw err;
        client.ensureIndex('users', 'password', function(err){
            if(err) throw err;
            console.log('\033[96m + \033[39m ensured indexes');

            /**
             * 监听
             */
            app.listen(3000, function(){
                console.log('\033[96m + \033[39m app listening on *:3000');
            });
        });
    });
});
