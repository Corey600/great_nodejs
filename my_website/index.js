/**
 * Created by feichenxi on 2015/7/15.
 */

var fs      = require('fs');
var connect = require('connect');
var time    = require('./lib/request_time');
var users   = require('./files/users.json');

var server = connect.createServer();

/**
 * 记录请求情况
 */
server.use(connect.logger('short'));

/**
 * 托管静态资源
 */
//server.use(connect.static('website'));

/**
 * body 解析中间件
 */
server.use(connect.bodyParser({ keepExtensions: true, uploadDir: './files' }));

/**
 * 文件处理
 */
server.use(function(req, res, next){
    var file_list = [];
    var string = [];

    if('POST' == req.method && req.files){
        //console.log(req.files); // 书上有误，不是req.body.file而是req.files
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

/**
 * 读写cookie中间件
 */
server.use(connect.cookieParser());

/**
 * 读写cookie中间件
 */
server.use(connect.session({ secret: 'my app secret' }));

/**
 * 检查登录
 */
server.use(function(req, res, next){
    if('/' == req.url && req.session.logged_in){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(
            'Welcome back, <b>' + req.session.name + '</b>. '
            + '<a href="/logout">Logout</a>'
        );
    }else{
        next();
    }
});

/**
 * 登录
 */
server.use(function(req, res, next){
    if('/' == req.url && 'GET' == req.method){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(
            '<form action="/login" method="POST">'+
                '<fieldset>' +
                    '<legend>Please log in</legend>' +
                    '<p>User:<input type="text" name="user"/></p>' +
                    '<p>Password:<input type="password" name="password"/></p>' +
                    '<button>Submit</button>' +
                '</fieldset>' +
            '</form>'
        );
    }else{
        next();
    }
});

/**
 * 验证登录
 */
server.use(function(req, res, next){
    if('/login' == req.url && 'POST' == req.method){
        res.writeHead(200);
        if(!users[req.body.user] || req.body.password != users[req.body.user].password){
            res.end('Bad username/password');
        }else{
            req.session.logged_in = true;
            req.session.name = users[req.body.user].name;
            res.end('Authenticated!');
        }
    }else{
        next();
    }
});

/**
 * 登出
 */
server.use(function(req, res, next){
    if('/logout' == req.url){
        req.session.logged_in = false;
        res.writeHead(200);
        res.end('Logged out!');
    }else{
        next();
    }
});

/**
 * 实现时间中间件
 */
server.use(time({ time: 500 }));

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
