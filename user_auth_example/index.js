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
 * Ĭ��·��
 */
app.get('/', function(req, res){
    res.render('index', { authenticated: false });
});

/**
 * ��½·��
 */
app.get('/login', function(req, res){
    res.render('login');
});

/**
 * ע��·��
 */
app.get('/signup', function(req, res){
    res.render('signup');
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
     * ����
     */
    app.listen(3000, function(){
        console.log('\033[96m + \033[39m app listening on *:3000');
    });
});
