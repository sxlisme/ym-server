var mysql = require('mysql');
var md5 = require('md5');
var util = require('util'); // 重点
var os = require("os");
var platform = os.platform(); // 判断型号
var sqlpwd = 'FG7jbHTBkkJwx7ip';
if (platform === 'win32') {
    sqlpwd = 'admin'
}
console.log(sqlpwd);
//连接数据库池子
var pool = mysql.createPool({
    user: 'root',
    password: sqlpwd,
    connectionLimit: 10
});

const tableTask = 'bbdb.task'; //任务表
const tableUser = 'bbdb.user'; //用户表
//分割线-----------注册用户以及登录认证--------------

//注册之前判断用户是否存在
//参数:sql
function isExist(sql) {
    return new Promise((reslove, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject('连接池出问题了!!!');
                console.log(err);
            } else {
                connection.query(sql, (err, data, fields) => {
                    if (err) {
                        reject('sql查询报错了!!!');
                    } else {
                        if (data.length === 0) {
                            reslove(fasle); //不存在                            
                        } else {
                            reslove(true); //存在
                        }
                    };
                    connection.release();
                });
            }
        });
    });
}

//数据库操纵 新增方法 删除方法 编辑方法
function DML(sql, param = {}) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject('连接池出问题了!!!');
                console.log(err);
            } else {
                connection.query(sql, (err, data, fields) => {
                    // /console.log(sql + "---" + err);
                    //console.log(typeof data);
                    if (err) {
                        reject('数据格式出错了' + err);
                        console.log(err);
                        return;
                    };
                    data = JSON.stringify(data); //处理返回数据

                    try {
                        data = JSON.parse(data);
                        resolve({ data: data, param: param }); //操作成功
                        connection.release();
                    } catch (e) {
                        reject('数据格式出错了' + e);
                    };

                });
            }
        });
    });
}
//分页查询 任务列表
function queryTaskTotal(res, param) {
    var { page, name } = param;
    var size = 10; //每页10条
    //先查询总数
    var sql;
    if (name == '' || name == '所有') {
        sql = `select count(*) total from ${tableTask} `;
    } else {
        sql = `select count(*) total from ${tableTask} where username = '${name}'`;
    };

    DML(sql, '666').then((result) => {
        console.log(typeof result);
        console.log(result);
        var total = result.data[0].total;
        var snum = (page - 1) * size;
        if (name == '' || name == '所有') {
            sql = `select id, uid ,type, username ,insert_time,finish_time,group_num,status,cookies,harvest,has_goods from bbdb.task order by insert_time desc limit ${snum},${size};`

        } else {
            sql = `select id,uid ,type, username ,insert_time,finish_time,group_num,status,cookies,harvest,has_goods from bbdb.task where username = '${name}' order by insert_time desc limit ${snum},${size};`

        }
        return DML(sql, result.data[0].total);
    }).then((result) => {

        var jsonRes = { code: 200, msg: '获取列表成功', data: result.data, total: result.param }
        res.json(jsonRes);
    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, msg: '获取列表失败' }
        res.json(jsonRes);
    });
}


//新增任务
function addTask(res, param) {
    var { uid, username, type, times, cookies } = param;
    var sql = `insert into bbdb.task( uid , username, type,group_num,cookies )
                values
                ( '${uid}', '${username}', '${type}', ${times},'${cookies}');`;
    console.log(sql);
    DML(sql, '666').then((result) => {

        res.json({ code: 200, msg: '新增任务成功!' });
    }).catch((e) => {
        res.json({ code: 500, msg: '新增任务失败!' });
    })


}

// var sql = `select username from bbdb.yangmaouser where username = 'xiaoliang';`
// isExist(sql).then((result) => {
//     console.log(result);    
// }).then((result) => {
//     console.log('2:' + result);
// }).catch((e) => {
//     console.log(e);
// })

//登录
function login(res, param) {
    //用户名 ,密码 
    var { username, password } = param;
    var password = md5(username + password);
    var sql = `select id ,username,password from ${tableUser} where username = '${username}';`
    console.log(sql);
    DML(sql).then((result) => {
        console.log(result);
        console.log("***");


        if (result.data && result.data.length === 0) {
            var jsonRes = { code: 500, msg: '账户不存在' }
            res.json(jsonRes);
        } else if (result.data[0].password === password) {
            var uname = result.data[0].username;
            var uid = result.data[0].id;
            var jsonRes = { code: 200, msg: '登陆成功', user: { name: uname, avatar: '', id: uid } }
            res.json(jsonRes);
        } else {
            var jsonRes = { code: 500, msg: '账户或者密码错误!' }
            res.json(jsonRes);
        }
    }).catch((err) => {
        console.log(err);
        var jsonRes = { code: 500, msg: '登陆验证发生错误!' }
        res.json(jsonRes);
    });

    return;

};


// api 

//注册用户
function regUser(res, param) {

    //用户名 ,密码 
    var { username, gropid, pass } = param;
    var password = md5(username + pass);
    //1.判断用户名是否存在
    var sql1 = `select username,password from bbdb.user where username = '${username}';`

    var sql2 = `insert into bbdb.user( username ,password,reg_time,groupid) values('${username}','${password}',unix_timestamp(NOW()),${gropid});`

    DML(sql1, '').then((result) => { //判断是否存在
        console.log(typeof result);
        if (result.data && result.data.length === 0) {
            console.log('不存在,可注册');
            return DML(sql2, '');
        } else {
            console.log('存在不可注册');
            throw new Error('用户已存在,不可注册');
        };

    }).then((result) => {
        console.log('注册成功');
        var jsonRes = { code: 200, data: '注册成功!' }
        res.json(jsonRes);
    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, data: '注册失败,此用户名可能已经存在!' };
        res.json(jsonRes);
    });


};

//获取用户列表
function getUserList(res) {
    var sql = `select username as value from ${tableUser};`
    DML(sql, '').then((result) => {
        var jsonRes = { code: 200, msg: '获取用户列表成功!', data: result.data }
        res.json(jsonRes);
    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, msg: '获取用户列表失败!' };
        res.json(jsonRes);
    });

}

//根据uid 获取session
function getSession(res, param) {
    //用户名 ,密码 
    var { uid } = param;
    console.log(param);
    var sql = `select cookies as session, status from bbdb.task  where uid = ${uid}  order by insert_time desc  limit 0,1`;


    DML(sql, '').then((result) => { //获取用户信息
        console.log(typeof result);
        console.log(result);
        if (result && result.data) {
            res.json({ code: 200, data: result.data });
        } else {
            res.json({ code: 500, msg: '获取session失败' });
        }

    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, msg: '获取session失败' };
        res.json(jsonRes);
    });
}
//游戏日志
function getGameLog(res, param) {
    var { page, size, taskid } = param;
    var curRow = (page - 1) * size;
    //查日志总条数
    var sql1 = `select count(1) as total  from bbdb.game_log where task_id = ${taskid};`
    //分页查日志：
    var sql2 = `select id , win_time, game_type, reward,reward_type from bbdb.game_log where task_id = ${taskid} limit ${curRow}, ${size};`

    DML(sql1, '').then((result) => {
        console.log(typeof result);
        console.log(result);
        var total = result.data[0].total;
        return DML(sql2, result.data[0].total);
    }).then((result) => {
        var jsonRes = { code: 200, msg: '获取列表成功', data: result.data, total: result.param }
        res.json(jsonRes);
    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, msg: '获取列表失败', data: [] }
        res.json(jsonRes);
    });
}
//获取游戏礼物 参数 用户名
function getGifts(res, param) {

    var { page,size,username } = param;
    var curRow = (page - 1) * size;

    //求总数
    var sql1 = `select  count(*) as total  from bbdb.game_log where name_flag = '${username}' and  reward_type =1 ;`

    //分页查询
    var sql2 = `select  game_type,id,name_flag,reward, reward_type,task_id,win_time from bbdb.game_log where name_flag = '${username}' and  reward_type =1 order by id desc limit ${curRow}, ${size};`
    
     DML(sql1, '').then((result) => {
        console.log(typeof result);
        console.log(result);
        var total = result.data[0].total;
        return DML(sql2, result.data[0].total);
    }).then((result) => {
        var jsonRes = { code: 200, msg: '获取列表成功', data: result.data, total: result.param }
        res.json(jsonRes);
    }).catch((e) => {
        console.log(e);
        var jsonRes = { code: 500, msg: '获取列表失败', data: [] }
        res.json(jsonRes);
    });
}
module.exports = {
    regUser, //注册
    login, //登陆
    queryTaskTotal, //分页查询任务列表
    addTask, //新增任务
    getUserList, //获取用户列表
    DML,
    getSession,
    getGameLog,
    getGifts
}