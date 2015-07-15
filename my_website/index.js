/**
 * Created by feichenxi on 2015/7/15.
 */

var connect = require('connect');
var time = require('./lib/request_time');

var server = connect.createServer();

/**
 * ��¼�������
 */
server.use(connect.logger('short'));

/**
 * ʵ��ʱ���м��
 */
server.use(time({ time: 500 }));

/**
 * �йܾ�̬��Դ
 */
server.use(connect.static(__dirname + '/website'));

/**
 * ������Ӧ
 */
server.use(function(req, res, next){
    if('/fast' == req.url){
        res.writeHead(200);
        res.end('Fast!');
    }else{
        next();
    }
});

/**
 * ������Ӧ
 */
server.use(function(req, res, next){
    if('/slow' == req.url){
        setTimeout(function(){
            res.writeHead(200);
            res.end('Slow!');
        }, 1000);
    }else{
        next();
    }
});

server.listen(3000);