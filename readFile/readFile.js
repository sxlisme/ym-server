//读取并返回文件
var fs = require("fs");

function get_file_content(filepath){
	//console.log(fs.readFileSync(filepath));
    return fs.readFileSync(filepath);
}

module.exports = {
 get_file_content
 
}