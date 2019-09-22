var mysql = require('mysql');
var md5 = require('md5');
const util = require('util'); //重点
//连接数据库池子
var pool = mysql.createPool({
    user: 'root',
    password: 'admin',
    connectionLimit: 10
});

//分割线-----------注册用户以及登录认证--------------
//reg 注册用户
function regUser(param) {
    //
    //用户名 ,密码 
    var { name, gropid, pass } = param;
    var password = md5(name + pass);
    var sql = `insert into bbdb.yangmaouser( username ,password,reg_time,groupid) values('${name}','${password}',unix_timestamp(NOW()),${gropid});`

    console.log(sql);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({ code: 500, msg: '注册失败!' });
        } else {
            connection.query(sql, (err, data, fields) => {
                if (err) {
                    var jsonRes = { code: 500, msg: '注册失败!' }
                    res.json(jsonRes);
                    console.log(err);
                } else {
                    //console.log(data);
                    var jsonRes = { code: 200, msg: '注册成功!' }
                    res.json(jsonRes);
                }
            });
            connection.release(); //释放
        }
    });
};

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
                    console.log(sql+"---"+param);
                    console.log(typeof data);
                    data = JSON.stringify(data); //处理返回数据
                    console.log("83:"+data);
                    try {
                        data = JSON.parse(data);
                        resolve({data: data, param: param }); //操作成功
                        connection.release();
                    } catch (e) {
                        reject('数据格式出错了' + e);
                    };

                });
            }
        });
    });
}
fenye();

function fenye() {
    //先查询总数
    var sql = `select count(*) total from bbdb.yangmaouser`;
    DML(sql,'666').then((result) => {
        console.log(typeof result);
        console.log(result);        
        sql = `select type , username ,times from bbdb.task limit 12,40;`
        return DML(sql, result.data[0]);
    }).then((result) => {
        console.log(result);
    }).catch((e) => {
        console.log(e);
    });
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
    var sql = `select username,password from bbdb.yangmaouser where username = '${username}';`

    console.log(sql);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({ code: 500, msg: '数据库查询错误!' });
        } else {
            connection.query(sql, (err, data, fields) => {
                if (err) {
                    var jsonRes = { code: 500, msg: '数据库查询错误!' }
                    res.json(jsonRes);
                    console.log(err);
                } else {
                    console.log(data);
                    if (data.length === 0) {
                        //用户名不存在
                        var jsonRes = { code: 400, msg: '验证失败!' }
                        res.json(jsonRes);
                    } else if (data[0].password === password) {
                        var jsonRes = { code: 200, msg: '登陆成功', user: { name: username, avatar: '' } }
                        res.json(jsonRes);
                    } else {
                        //密码错误
                        var jsonRes = { code: 400, msg: '验证失败!' }
                        res.json(jsonRes);
                    }

                }
            });
            connection.release(); //释放
        }
    });
};


