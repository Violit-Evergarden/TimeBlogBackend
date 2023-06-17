// //导入mysql
// const mysql=require('mysql')

// //创建数据库连接对象
// const db=mysql.createPool({
//   host:'127.0.0.1',//10.127.251.222    10.132.181.172
//   user:'root',
//   password:'admin123',
//   database:'my_db_01'
// })

// //向外共享db数据库的连接对象
// module.exports=db

const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://127.0.0.1:27017/killer');

db.on('error',console.error.bind(console,'connection error:'))
db.once('open',function(){
	console.info("数据库killer开启！")
})

module.exports = db;