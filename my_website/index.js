/**
 * Created by feichenxi on 2015/7/15.
 */

var fs = require('fs');
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
 * body 解析中间件
 */
server.use(connect.bodyParser({ keepExtensions: true, uploadDir: './files' }));

/**
 * 托管静态资源
 */
server.use(connect.static('website'));

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

/**
 * 文件处理
 */
server.use(function(req, res, next){
    if('POST' == req.method && req.files){
        //console.log(req.files); // 书上有误，不是req.body.file而是req.files
        for(var file in req.files){
            if(req.files.hasOwnProperty(file)){
                fs.readFile(file.path, 'utf8', function(err, data){
                    if(err){
                        res.writeHead(500);
                        res.end('Error');
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end([
                        '<h3>File: '+file
                    ].join(''));
                });
            }
        }
    }else{
        next();
    }
});

server.listen(3000);
