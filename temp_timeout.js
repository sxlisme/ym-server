var schedule = require('node-schedule');
var DML = require('./mysql/DMLPromise.js');
var userInfo = [{ name: 'xiaoliang', time: '1900-01-01 00:01:01' },
				{ name: 'xiaoliang', time: '1900-01-01 18:00:00' }
   
];


function getAllTime(userInfo) {
    var times = [];
    for (var i = 0; i < userInfo.length; i++) {
        var s = new Date(userInfo[i].time).getSeconds();
        var m = new Date(userInfo[i].time).getMinutes();
        var h = new Date(userInfo[i].time).getHours();
        var temp = `${s} ${m} ${h} * * *`
        times.push(temp);
    }

    return times;
}
// start();

function start() {
	console.log('定时器打开'+new Date());
    var times = getAllTime(userInfo);
    for (let i = 0; i < times.length; i++) {
        schedule.scheduleJob(times[i], () => {

            var sql = `	insert 
						into bbdb.task(uid ,username ,type,group_num ,cookies) 
   						select 
						uid ,username ,type,group_num ,cookies 
						from 
						bbdb.task 
						where username='${userInfo[i].name}' 
						order by insert_time  
						desc limit 0,1;`;
            //console.log(sql);
            insertSql(sql);

        });
    }
}
// var sqlAll = `select 
// 			*
// 			from 
// 			bbdb.task 
// 			where username='xiaoliang' 
// 			order by insert_time  
// 			desc limit 0,1;`
// var querysql = `select 
// 			uid ,username ,type,group_num ,cookies 
// 			from 
// 			bbdb.task 
// 			where username='xiaoliang' 
// 			order by insert_time  
// 			desc limit 0,1;`

// var insertSql = `insert 
// into bbdb.task(uid ,username ,type,group_num ,cookies) 
//       select 
// 			uid ,username ,type,group_num ,cookies 
// 			from 
// 			bbdb.task 
// 			where username='xiaoliang' 
// 			order by insert_time  
// 			desc limit 0,1;`

// const scheduleCronstyle = () => {
//     //每分钟的第30秒定时执行一次:
//     schedule.scheduleJob('30 * * * * *', () => {
//         console.log('scheduleCronstyle:' + new Date());
//     });
// }
// scheduleCronstyle();


function insertSql(insertSql) {
    DML.DML(insertSql).then((res) => {
        //console.log(res);
    }).catch((e) => {
        console.log(e);
    });
}

module.exports = {
    start
}