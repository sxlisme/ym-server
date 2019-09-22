//智能键盘配置后台;我们的征途是星辰大海!
var fs = require("fs");
var http = require('http');
var url = require('url');
var express = require('express');
// var mysql= require('mysql');
var app = express();
//导入路径模块
var path = require('path');
//导入querystring模块（解析post请求数据）
var querystring = require('querystring');
//导入数据库操作js
var doSql = require('./mysql/yangmaoUserMysql.js');
//新版的sql
var DML = require('./mysql/DMLPromise.js');

//导入文件读取的js
var readFile = require('./readFile/readFile.js');
//运行后自动打开浏览器
const nodeopen = require('nodeopen');
var os = require("os");
var platform = os.platform();
var timeout = require('./temp_timeout.js');
timeout.start(); //定时
let listenPort = platform === 'win32' ? 8456 : 8848;

//服务器监听端口
app.listen(listenPort);
console.log(`监听localhost:${listenPort}`);
//打开浏览器
// nodeopen(`http://localhost:` + listenPort);

app.use(express.static(__dirname)); //重点 设置静态资源


app.all('/*', function(req, res) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    console.log(deviceAgent);
    var isMobild = deviceAgent.match(/(iphone|ipod|ipad|android|phone)/);
    if (platform === 'win32') { //开发环境测试
        res.header("Access-Control-Allow-Origin", "*");
    };
    //var cookie=req.headers.cookie;
    console.log("请求路径：" + req.url);
    var filename = req.url.split('/')[req.url.split('/').length - 1];
    var suffix = req.url.split('.')[req.url.split('.').length - 1];
    console.log("文件名:" + suffix);
    var projectPath = __dirname + '/';
    if (req.url === '/') { //羊毛首页       
        res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.end(readFile.get_file_content(__dirname + '/static/mobile/index.html'));
        if (isMobild) {
            res.end(readFile.get_file_content(__dirname + '/static/index_m.html'));
        }
        else{
            res.end(readFile.get_file_content(__dirname + '/static/index.html'));
        }

    } else if (suffix === 'css') { //css文件
        res.writeHead(200, { 'Content-Type': 'text/css' });
        console.log(projectPath + req.url)
        res.end(readFile.get_file_content(projectPath + req.url));
    } else if (suffix === 'js') { //js文件
        res.writeHead(200, { 'Content-Type': 'application/x-javascript' });
        console.log(projectPath + req.url)
        res.end(readFile.get_file_content(projectPath + req.url));
    } else if (suffix === 'woff' || suffix === 'ttf') { //字体文件
        console.log('字体文件' + suffix);
        res.writeHead(200, { 'Content-Type': 'application/font-' + suffix });
        res.end(readFile.get_file_content(projectPath + req.url));
    } else if (suffix in ['gif', 'jpeg', 'jpg', 'png']) { //图片文件
        res.writeHead(200, { 'Content-Type': 'image/' + suffix });
        res.end(readFile.get_file_content(projectPath + req.url));
    } else if (req.url === '/getCodesNoNull') { //列表请求
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });

        // 3.当接收表单提交的数据完毕之后，就可以进一步处理了
        //注册end事件，所有数据接收完成会执行一次该方法
        req.on('end', function() {
            doSql.getCodesNoNull(res);
        });

    } else if (req.url === '/setOpenUrlAndIco') { //设置打开页面和图标
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {

            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);
            if (reqParm) {
                reqParm = JSON.parse(reqParm);
                var openurl = reqParm.openurl;
                var ico = reqParm.ico;
                var keycode = reqParm.keycode;
                var descstr = reqParm.descstr;
                console.log(`${openurl},${ico},${keycode}`);
                doSql.setOpenUrlAndIco(res, openurl, ico, keycode, descstr); //123 is f12 
            } else {
                res.json({ code: 500, data: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/login') { //yangmao 
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {

            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);
            if (reqParm) {
                reqParm = JSON.parse(reqParm);
                DML.login(res, reqParm);
            } else {
                res.json({ code: 500, msg: '服务端未获取到用户名称或者密码!!!' })
            }

        });
    } else if (req.url === '/getSession') { //yangmao 
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {

            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);
            if (reqParm) {
                reqParm = JSON.parse(reqParm);
                DML.getSession(res, reqParm);
            } else {
                res.json({ code: 500, msg: '没有传参数怎么查?' })
            }

        });
    } else if (req.url === '/regUser') { //设置页面
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(readFile.get_file_content(__dirname + '/static/reg.html'));
    } else if (req.url === '/tasks/regUser') { //注册用户
        //res.writeHead(200, {'Content-Type': 'text/html'}); //这里不可设置,会报错的~~~
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {
            reqParm = JSON.parse(reqParm);
            console.log(reqParm);
            DML.regUser(res, reqParm);

        });

    } else if (req.url === '/tasks/addTasks') { //yangmao  新增任务
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {

            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);
            if (reqParm) {
                try {
                    reqParm = JSON.parse(reqParm);
                } catch (e) {

                    res.json({ code: 500, msg: 'e' })
                }
                //reqParm = JSON.parse(reqParm); 
                //console.log(reqParm);
                console.log(reqParm);
                console.log(typeof reqParm);

                DML.addTask(res, reqParm.params);
            } else {
                res.json({ code: 500, msg: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/tasks/getTaskLists') { //yangmao 获取任务列表 分页
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {
            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);

            if (reqParm) {
                try {
                    reqParm = JSON.parse(reqParm);
                    console.log(reqParm);
                    DML.queryTaskTotal(res, reqParm.params);
                } catch (e) {
                    res.json({ code: 500, msg: e });
                    //return;
                };

            } else {
                res.json({ code: 500, msg: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/tasks/getGameLog') { //yangmao 获取任务日志 分页
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {
            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);

            if (reqParm) {
                try {
                    reqParm = JSON.parse(reqParm);
                    console.log(reqParm);
                    DML.getGameLog(res, reqParm.params);
                } catch (e) {
                    res.json({ code: 500, msg: e });
                    //return;
                };

            } else {
                res.json({ code: 500, msg: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/tasks/getGifts') { //yangmao 获取礼物 分页
        var reqParm = '';
        req.on('data', function(chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            reqParm += chunk;
        });
        req.on('end', function() {
            //（1）.对url进行解码（url会对中文进行编码）
            reqParm = decodeURI(reqParm);
            
            if (reqParm) {
                try {
                    reqParm = JSON.parse(reqParm);
                    console.log(reqParm.params+'***');                    
                    DML.getGifts(res, reqParm.params);
                } catch (e) {
                     
                    res.json({ code: 500, msg: e });
                    //return;
                };
            } else {
                res.json({ code: 500, msg: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/tasks/test') { //测试
        var reqParm = '';
        req.on('data', function(chunk) {
            reqParm += chunk;
        });
        req.on('end', function() {
            reqParm = decodeURI(reqParm);
            if (true) {
                var a = doSql.getUserPromise();
                res.json(a);
            } else {
                res.json({ code: 500, msg: '服务端未获取到参数!!!' })
            }

        });
    } else if (req.url === '/tasks/getUserList') { //yangmao 获取用户列表

        DML.getUserList(res);
    } else if (req.url === '/favicon.ico') {
        res.end(readFile.get_file_content(projectPath + req.url));
        //res.end(faviconIco);
        // res.end(); 
    } else {
        res.json({ code: 500, data: '没有此路径!' });
        res.end();
    }
});


var faviconIco = 'data:image/png;base64,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'

//getAllData

//var upDataSql = `update ${databaseTableName} set openurl = '${openurl}',ico = '${ico}' where keycode ='1' ;`;
//console.log(upDataSql);
//console.log(upDataSql);

//querycode(upDataSql)

//查询不为空的数据
//doSql.getCodesNoNull(res);

//设置打开页面和ico
//doSql.setOpenUrlAndIco(res,openurl,ico,keycode);//123 is f12