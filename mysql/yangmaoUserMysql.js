var mysql= require('mysql');
var md5 = require('md5');
const util = require('util');//重点
//连接数据库池子
var pool =mysql.createPool({
  user:'root',
  password:'admin',
  connectionLimit:10
});


//数据库名称
const databaseTableName   =  'bbdb.keycode ';
//分页查询 1.查询总数
function totals(res,param){
  var sql = `SELECT COUNT(*) as total   FROM bbdb.keycode;`
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,data:''}
                res.json(jsonRes);
                console.log(err);
              }else{
                pageQuery(res,param,data[0].total);                           
              }
            });
            connection.release();//释放
          }
    });
}
//2.按页码查询
function pageQuery(res,param,total){
  var {currentPage,size} =param;
  //分页
  var startRows = size*(currentPage-1)+1;
  //var endRows = ;
  console.log();
  var sql = `select descstr,keycode,keynamechn,keynameeng,openurl,ico from bbdb.keycode limit ${startRows},${size};`;
  //console.log(sql);
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,data:''}
                res.json(jsonRes);
                console.log(err);
              }else{
                //console.log(data);
                var jsonRes = {code:200,totals:total,data:data}
                res.json(jsonRes);                              
              }
            });
            connection.release();//释放
          }
    });
}


//查询使用 统一方法
function querycode(res,sql){
	//console.log('执行sql:'+sql);
	pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
              	var jsonRes = {code:500,data:''}
              	res.json(jsonRes);
                console.log(err);
              }else{
              	//console.log(data);
              	var jsonRes = {code:200,data:data}
              	res.json(jsonRes);                              
              }
            });
            connection.release();//释放
          }
    });
}

//修改数据库使用
function DMLcode(res,sql){
	console.log('执行sql:'+sql);
	pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
              	var jsonRes = {code:500,data:'操作失败!'}
              	res.json(jsonRes);
                console.log(err);
              }else{
              	//console.log(data);
              	var jsonRes = {code:200,data:'操作成功!'}
              	res.json(jsonRes);

                for (var i = 0;i<data.length;i++) {
                                  
                }               
              }
            });
            connection.release();//释放
          }
    });
}



//获取不为null的数据 无需参数
function getCodesNoNull(res){
	var sql = `select keycode,keynamechn,keynameeng,openurl,ico,descstr from bbdb.keycode where openurl !='null' and openurl !='' ;`;
	querycode(res,sql);
}
//设置url 和 ico 
function setOpenUrlAndIco(res=false,openurl='',ico='',keycode=123,descstr=''){
		 if (keycode===123) {//f12 专属不设置
		 	openurl = null;
		 	ico = null;
		 };
		var sql = `update bbdb.keycode set openurl = '${openurl}',ico = '${ico}',descstr='${descstr}' where keycode ='${keycode}' ;`
		DMLcode(res,sql);	

}

//获取所有数据
function getAllData(res,param){
	//var sql = `select descstr,keycode,keynamechn,keynameeng,openurl,ico from bbdb.keycode ;`;
	totals(res,param);
}

//分割线-----------注册用户以及登录认证--------------
//reg 注册用户
function regUser(res,param){
  //用户名 ,密码 
  var {name,gropid,pass1} =param; 
  var password = md5(name+pass1);
  var  sql = `insert into bbdb.yangmaouser( username ,password,reg_time,groupid) values('${name}','${password}',unix_timestamp(NOW()),${gropid});`

  console.log(sql);
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
            res.json({code:500,msg:'注册失败!'});
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,msg:'注册失败!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                //console.log(data);
                var jsonRes = {code:200,msg:'注册成功!'}
                res.json(jsonRes);                              
              }
            });
            connection.release();//释放
          }
    });
};
//注册之前判断用户是否存在
function isExistToRegUser(res,param){

  //用户名 ,密码 
  var {name} =param;   
  var  sql = `select username from bbdb.yangmaouser where username = '${name}';`

  console.log(sql);

  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
            res.json({code:500,data:'数据库查询错误!'});
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,data:'数据库查询错误!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                console.log(data);
                if(data.length===0){                  
                    //用户名不存在,可以执行
                    regUser(res,param);  
                }else{
                    //已注册
                   var jsonRes = {code:500,msg:'该用户名已经存在!',data:'该用户名已经存在!'}
                   res.json(jsonRes);     
                }
                                        
              }
            });
            connection.release();//释放
          }
    });
}

//登录
function login(res,param){
  //用户名 ,密码 
  var {username,password} =param; 
  var password = md5(username+password);
  var  sql = `select username,password from bbdb.yangmaouser where username = '${username}';`

  console.log(sql);
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
            res.json({code:500,msg:'数据库查询错误!'});
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,msg:'数据库查询错误!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                console.log(data);
                if(data.length===0){
                   //用户名不存在
                   var jsonRes = {code:400,msg:'验证失败!'}
                   res.json(jsonRes);     
                }else if(data[0].password===password){
                    var jsonRes = {code:200,msg:'登陆成功',user:{name:username,avatar:''}}
                    res.json(jsonRes);
                }else{
                  //密码错误
                   var jsonRes = {code:400,msg:'验证失败!'}
                   res.json(jsonRes);     
                }
                                        
              }
            });
            connection.release();//释放
          }
    });
};



//新增任务
function addTask(res,param){
  //获取必要的参数
  var {cookie,username,type,times} =param;  
  var sql = `insert into bbdb.task ( cookie,username,type,times,committime,status) values('${cookie}','${username}','${type}',${times},unix_timestamp(NOW()),'wait');`
  console.log(sql);
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
            res.json({code:500,data:'新增失败!'});
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,data:'新增失败!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                //console.log(data);
                var jsonRes = {code:200,data:'新增任务成功!'}
                res.json(jsonRes);                              
              }
            });
            connection.release();//释放
          }
    });
};

//获取任务列表 分页获取
function getTaskList(res,param,total){
  var {page,name} = param;
  var size = 10;//暂时每页设置20条
  var startRows = (page*1-1)*size;//起始页面
  var sql ='';
  if(name==''||name =='所有'){
    sql = `select cookie,username,type,times,committime,endtime, status,gifts from bbdb.task order by committime desc limit ${startRows},${size} ;`;
  }else{
    sql = `select cookie,username,type,times,committime,endtime, status,gifts from bbdb.task where username='${name}'  order by committime desc limit ${startRows},${size};`;

  }
  //每页按20条处理
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,msg:'获取任务列表失败!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                //console.log(data);
                var jsonRes = {code:200,total:total,data:data}
                res.json(jsonRes);                              
              }
            });
            connection.release();//释放
          }
    });
}

function queryTaskTotal(res,param){

  var sql = `SELECT COUNT(*) as total   FROM bbdb.task;`
  pool.getConnection((err,connection)=>{
          if(err){
            console.log(err);
          }else{
            connection.query(sql,(err,data,fields)=>{
              if (err) {
                var jsonRes = {code:500,data:'总数获取失败!'}
                res.json(jsonRes);
                console.log(err);
              }else{
                getTaskList(res,param,data[0].total);                           
              }
            });
            connection.release();//释放
          }
    });

}   
// cookie: "*a54f0b727E568",
// username: "sxl",
// type:'mx',
// times:20,
// committime: "2019-08-31 13:50:56",
// endtime: "2019-8-31 14:20:25",
// score:9999875,
// status:'doing',
// gifts:'双立人三件套'

//获取用户列表
function queryYangmaoUser(res){
  var sql = `select username as value from bbdb.yangmaouser;`
  querycode(res,sql);
}

//导出函数
module.exports = {
 getCodesNoNull,
 setOpenUrlAndIco,
 getAllData,
 regUser,
 isExistToRegUser,
 login,
 addTask,
 //getTaskList,
 queryTaskTotal,
 queryYangmaoUser,
 //test
}