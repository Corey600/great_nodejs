/**
 * Created by feichenxi on 2015/7/20.
 */

/**
 * ģ������
 */
var express = require('express');
var mongodb = require('mongodb');

/**
 * �������ó���
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
 * Ĭ��·��
 */
app.get('/login', function(req, res){
    res.render('login');
});

/**
 * Ĭ��·��
 */
app.get('/signup', function(req, res){
    res.render('signup');
});

/**
 * ����
 */
app.listen(3000);
