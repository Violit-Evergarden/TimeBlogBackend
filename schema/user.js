//导入验证规则的包
const joi=require('joi')

//定义用户名和密码的验证规则
const username=joi.string().alphanum().min(5).max(12).required()
const password=joi.string().pattern(/^[\S]{6,15}$/).required()
const email=joi.any()

//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema={
  body:{
    username,
    password,
    email
  }
}