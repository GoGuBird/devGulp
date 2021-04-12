//模拟数据接口

var fs = require('fs')
var path = require('path')
var mockpath = path.join(__dirname, '/build/mock')

//res响应头
//pathname 路径，及请求的路径
//paramsObj url参数中回调函数名,类似JSONP原理
//next 流继续执行参数，没有next则终端

var mockApi = function(res, pathname, paramsObj, next) {
    switch (pathname) {
        case '/mock/test':
            var data = fs.readFileSync(path.join(mockpath, 'test.json'), 'utf-8');
            res.setHeader('Content-type', 'application/javascript');
            //res.end(paramsObj.callback + '(' + data + ')');
            res.end(data);
            break;
        default:
            break;
    }
    next()
}

module.exports = mockApi