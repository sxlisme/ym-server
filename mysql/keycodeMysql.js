var mysql= require('mysql');


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


//查询使用
function querycode(res,sql){
	console.log('执行sql:'+sql);
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


//导出函数
module.exports = {
 getCodesNoNull,
 setOpenUrlAndIco,
 getAllData
 
}