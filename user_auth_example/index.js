/**
 * Created by feichenxi on 2015/7/20.
 */

/**
 * ģ������
 */
var express = require('express');
var mongodb = require('mongodb');

/**
 * ����Ӧ�ó���
 */
var app = express.createServer();

/**
 * �м��
 */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'my secret' }));

/**
 * ָ����ͼѡ��
 */
app.set('view engine', 'jade');
app.set('view options', { layout: false });

/**
 * �����֤�м��
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
 * Ĭ��·��
 */
app.get('/', function(req, res){
    res.render('index');
});

/**
 * ��½·��
 */
app.get('/login/:signupEmail?', function(req, res){
    res.render('login', { signupEmail: req.params.signupEmail });
});

/**
 * ��¼����·��
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
 * ע��·��
 */
app.get('/signup', function(req, res){
    res.render('signup');
});

/**
 * ����ע��·��
 */
app.post('/signup', function(req, res, next){
    console.log(req.body);
    app.users.insert(req.body.user, function(err, doc){
        if(err) return next(err);
        res.redirect('/login/' + doc[0].email);
    });
});

/**
 * �ǳ�·��
 */
app.get('/logout', function(req, res){
    req.session.loggedIn = null;
    res.redirect('/');
});

/***
 * �������ݿ�
 */
var server = new mongodb.Server('127.0.0.1', 27017);
new mongodb.Db('my-website', server).open(function(err, client){
    if(err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');
    app.users = new mongodb.Collection(client, 'users');

    /**
     * ��֤�ڲ�ѯǰ��������
     */
    client.ensureIndex('users', 'email', function(err){
       if(err) throw err;
        client.ensureIndex('users', 'password', function(err){
            if(err) throw err;
            console.log('\033[96m + \033[39m ensured indexes');

            /**
             * ����
             */
            app.listen(3000, function(){
                console.log('\033[96m + \033[39m app listening on *:3000');
            });
        });
    });
});
