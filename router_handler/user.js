//导入数据库操作模块
const db = require('../db/index')
//导入bcriptjs进行密码加密
const bcript = require('bcryptjs')
//导入生成Token的包
const jwt = require('jsonwebtoken')
//导入全局的配置文件（导入生成token时的配置信息（密钥，有效期等）)
const config = require('../config')

//查询用户名是否被占用的函数
exports.checkUser = (req, res) => {
  const sqlStr = 'select * from web_users where username=?'
  db.query(sqlStr, req.body.username, (err, result) => {
    if (err) return res.cc(err)
    if (result.length > 0) return res.cc('用户名以被占用')
    res.cc('用户名可用', 0)
  })
}

//注册新用户的处理函数
exports.regUser = (req, res) => {
  //获取客户端提交到服务器的用户信息
  const userinfo = req.body
  //调用bcript.hashSync()对密码进行加密
  userinfo.password = bcript.hashSync(userinfo.password, 10)
  //调用插入新用户的sql语句
  const sql = 'insert into web_users set ?'
  //调用db.query()执行sql语句
  db.query(sql,{ username: userinfo.username, password: userinfo.password,email:userinfo.email },(err, result) => {
      if (err) return res.cc(err)
      //判断影响行数是否为一
      if (result.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      //注册用户成功
      res.cc('注册成功！', 0)
    }
  )
}

exports.login = (req, res) => {
  //接收表单数据
  const userinfo = req.body
  //定义sql语句
  const sql = `select * from web_users where username=?`
  //执行sql语句，根据用户名查询用户的信息
  db.query(sql, userinfo.username, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('用户名或密码错误!')
    //判断密码是否正确
    const compareResult = bcript.compareSync(
      userinfo.password,
      result[0].password
    )
    if (!compareResult) return res.cc('用户名或密码错误！')

    //密码正确：在服务器端生成Token字符串
    const user = { ...result[0], password: '', user_pic: '' }
    //对用户的信息进行加密
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    //调用res.send()将token响应给客户端
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr,
    })
  })
}


