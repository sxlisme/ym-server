sql yamgmaosql
羊毛用户表 bbdb. yangmaouser

create table yangmaouser
(
username varchar(20) not null,
groupid tinyint(2) not null DEFAULT 2,
password varchar(50) not null,
reg_time int(11) not null DEFAULT 0,
last_login_time int(11) not null DEFAULT 0,
primary key (username) 
) engine=InnoDB;

管理员
insert into yangmaouser( username ,groupid ,password) 
	values
	('xiaoliang',1,'88e0b24996eda7c0b9edb29cfbc43dc5'); 

	//xiaoliang666 / 666
'a66abb5684c45962d887564f08346e8d'
insert into yangmaouser( username ,groupid ,password) values('admin',1,'a66abb5684c45962d887564f08346e8d'); //123456

普通用户
insert into yangmaouser( username ,password,reg_time) values('xiaolin','96a060566f715d73fa72f0ffaa611e0b',unix_timestamp(NOW()));

var md5 = require('md5'); 
console.log(md5('message'));

羊毛任务表 bbdb.task

create table task
(
taskid INT(20) not null AUTO_INCREMENT,
cookie varchar(50) not null,
username varchar(20) not null,
type varchar(5) not null DEFAULT 'mb',
times int(11) not null DEFAULT 10,
committime int(11) not null DEFAULT 0,
endtime int(11) not null DEFAULT 0,
score int(11) null DEFAULT 0,
status varchar(10) not null DEFAULT 'wait',
gifts varchar(1000) null,
primary key (taskid) 
) engine=InnoDB;

插入数据

insert into bbdb.task ( cookie,username,type,times,committime) values('SESSION=a56a87da-f6b8-4c67-87e8-ec93fc91d938','xiaoliang','mb',50,unix_timestamp(NOW()));


alter table task alter status drop default;


