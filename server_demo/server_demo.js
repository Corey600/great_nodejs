/**
 * Created by feichenxi on 2015/5/28.
 */
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(reg, res){
    if('GET' == reg.method
        && '/images' == reg.url.substr(0, 7)
        && '.jpg' == reg.url.substr(-4)){
        fs.stat(__dirname + reg.url, function(err, stat){
            if(err || !stat.isFile()){
                res.writeHead(404);
                res.end('not found1!');
                return;
            }
            serve(__dirname + reg.url, 'application/jpg');
        });
    }else if('GET' == reg.method
        && '/' == reg.url){
        serve(__dirname + '/index.html', 'text/html');
    }else{
        res.writeHead(404);
        res.end('not found2!');
    }

    function serve(path, type){
        res.writeHead(200, {'Content-Type': type});
        fs.createReadStream(path).pipe(res);
    }
});

server.listen(3000);
