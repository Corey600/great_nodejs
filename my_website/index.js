/**
 * Created by feichenxi on 2015/7/15.
 */

var fs = require('fs');
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
 * body �����м��
 */
server.use(connect.bodyParser({ keepExtensions: true, uploadDir: './files' }));

/**
 * �йܾ�̬��Դ
 */
server.use(connect.static('website'));

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

/**
 * �ļ�����
 */
server.use(function(req, res, next){
    if('POST' == req.method && req.files){
        //console.log(req.files); // �������󣬲���req.body.file����req.files
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
