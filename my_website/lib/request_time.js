/**
 * 请求时间中间件
 *
 * Created by feichenxi on 2015/7/15.
 */
module.exports = function(opt){
    var time = opt.time || 100;
    return function(req, res, next){
        var timer = setTimeout(function(){
            console.log(
                '\033[89m%s %s\033[39m \033[91mis taking too long!\033[39m'
                , req.method
                , req.url
            );
        }, time);

        var end = res.end;
        res.end = function(chunk, encoding){
            res.end = end;
            res.end(chunk, encoding);
            clearTimeout(timer);
        };
        next();
    };
};
