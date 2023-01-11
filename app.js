//导入express
const express=require('express')

//创建服务器实例对象
const app=express()

//导入验证规则的包以调用验证失败时的错误对象
const joi=require('joi')

//导入connect-history包
const history=require('connect-history-api-fallback')
app.use(history())


//导入并配置cors中间件（解决跨域问题）
const cors=require('cors')
app.use(cors())
//配置解析表单数据的中间件，注意：该中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({extended:false}))

//一定要在路由之前，封装res.cc函数
app.use((req,res,next)=>{
  //status默认值为1，表示失败的情况
  //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc=function(err,status=1){
    res.send({
      status,
      massage:err instanceof Error?err.message:err
    })
  }
  next()
})


//一定要在路由之前配置解新token的中间件
const expressJwt=require('express-jwt')
const config=require('./config')
app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

//导入并使用登录注册路由模块
const userRouter=require('./router/user')
app.use('/api',userRouter)
//导入并使用用户信息模块
const userInfoRouter=require('./router/userinfo')
app.use('/my',userInfoRouter)
//导入并使用日志模块
const journalRouter=require('./router/journal')
app.use('/journal',journalRouter)


//定义错误级别的中间件
app.use((err,req,res,next)=>{
  //验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  //token身份认证失败后的错误
  if(err.name==='UnauthorizeError') return res.cc('身份认证失败！')
  //未知的错误
  res.cc(err)
})


//启动服务器
app.listen(8889,()=>{
  console.log('api server running at http://127.0.0.1:8889')
})