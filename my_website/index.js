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
    var file_list = [];
    var string = [];

    if('POST' == req.method && req.files){
        //console.log(req.files); // �������󣬲���req.body.file����req.files
        for(var file in req.files){
            if(req.files.hasOwnProperty(file)){
                file_list[file_list.length] = req.files[file];
            }
        }
        read(0);
    }else{
        next();
    }

    function read(cnt){
        if(cnt >= file_list.length){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(string.join(''));
        }else{
            fs.readFile(file_list[cnt].path, 'utf8', function(err, data){
                if(err){
                    res.writeHead(500);
                    res.end('Error!');
                    return;
                }
                string[string.length] = '<h3>File: '+file_list[cnt].name+'</h3>';
                string[string.length] = '<h4>Type: '+file_list[cnt].type+'</h4>';
                string[string.length] = '<h4>Contents: '+data+'</h4>';
                read(cnt+1);
            });
        }
    }
});

server.listen(3000);
