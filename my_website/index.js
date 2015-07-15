/**
 * Created by feichenxi on 2015/7/15.
 */

var connect = require('connect');
var time = require('./lib/request_time');

var server = connect.createServer();

/**
 * 记录请求情况
 */
server.use(connect.logger('short'));

/**
 * 实现时间中间件
 */
server.use(time({ time: 500 }));

/**
 * 托管静态资源
 */
server.use(connect.static(__dirname + '/website'));

/**
 * 快速响应
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
 * 慢速响应
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