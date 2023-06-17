//导入数据库操作模块
const db = require('../db/index')
const fs = require('fs')

const dbmodel = require('../model/dbmodel')
const User = dbmodel.model('web_users')
const Friends = dbmodel.model('friends')

//保存用户头像
function saveUserimg(str,name){
  return new Promise((resovle,reject)=>{
    const data = str.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(data, 'base64');
    fs.writeFile(`./userimg/${name}.png`, dataBuffer, function(err) {
        if(err){
          console.log(err)
          reject(err)
        }else{
          resovle(name)
        }
    });
  })
}


exports.getUserInfo=(req,res)=>{
  // const sql=`select * from web_users where id=?`
  // console.log(222,req.user._doc._id)
  User.find({username:req.user._doc.username},(err,result)=>{
    if(err) return res.cc(err)
    if(result.length!==1) return res.cc('获取用户信息失败')
    if(!result[0]._doc.user_pic) result[0]._doc.user_pic = ''
    res.send({
      status:0,
      message:'获取用户信息成功',
      data:{...result[0]._doc,password:''}
    })
  })

  // this.getUserInfo()
  // db.query(sql,req.user.id,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length!==1) return res.cc('获取用户信息失败')
  //   res.send({
  //     status:0,
  //     message:'获取用户信息成功',
  //     data:{...result[0],password:''}
  //   })
  // })
}
exports.updateUserInfo=async (req,res)=>{
  // const sql= `update web_users set? where id=?`
  const userinfo=req.body
  const ip = req.ip==='::1'?'127.0.0.1':req.ip.split(':').at(-1)
  let picPath = ''
  if(userinfo.user_pic){
    const imgName = await saveUserimg(userinfo.user_pic,req.user._doc.username)
    picPath=`http://${ip}:8889/userimg/${imgName}.png`
    userinfo.user_pic = picPath
  }
  User.findOneAndUpdate({username:req.user._doc.username},{...userinfo},(err,result)=>{
    if(err) return res.cc(err)
    // if(result.affectedRows!==1) return res.cc('更新用户信息失败')
    console.log(result)
    res.send({
      status:0,
      message:'更新用户信息成功'
    })
  })
  // db.query(sql,[userinfo,userinfo.id],(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.affectedRows!==1) return res.cc('更新用户信息失败')
  //   res.send({
  //     status:0,
  //     message:'更新用户信息成功'
  //   })
  // })
}

exports.searchUsers=(req,res)=>{
  // const sql=`select * from web_users where username=?`
  const searchReg = new RegExp(`${req.query.username}`)
  const param = {
    $or:[
      {username:searchReg},
      {email:searchReg}
    ]
  }
  User.find(param,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('没有此用户',2)
    result.forEach(item=>{
      item.password = ''
    })
    res.send({
      status:0,
      message:'搜索到对应用户',
      data:result
    })
  })
  // db.query(sql,req.query.username,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length==0) return res.cc('没有此用户',2)
  //   res.send({
  //     status:0,
  //     message:'搜索到对应用户',
  //     data:{
  //       id:result[0].id,
  //       username:result[0].username,
  //       nickname:result[0].nickname,
  //       user_pic:result[0].user_pic,
  //       signature:result[0].signature
  //     }
  //   })
  // })
}

exports.addFriends=(req,res)=>{
  let myId=req.user._doc.username
  let otherId=req.query.otherId
  // const sql=`select friends from web_users where id=?`
  const friendslist = []
  // console.log('bas',myId,otherId)
  Friends.find({$or:[{userid:myId},{friendid:myId}]},(err,result)=>{
    if(err) return res.cc(err)
    console.log('sres',result)
    result.forEach(item=>{
      if(myId == item.userid) friendslist.push(item.friendid)
      else friendslist.push(item.userid)
    })
    // console.log('lis',friendslist)
    if(friendslist.indexOf(otherId)!==-1){
      res.send({status:1,message:'你已拥有该好友'})
    }else{
      Friends.create({userid:myId,friendid:otherId},(err, result) => {
        if (err) return res.cc(err)
        console.log('adres',result)
        if (result.inserting) return res.cc('添加好友失败，请稍后再试！')
        res.cc('成功！', 0)
      })
    }
  })
  // db.query(sql,myId,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length==0) return res.cc('出现了奇怪的错误')
  //   let oneUserFriends=''
  //   if(!result[0].friends) oneUserFriends=otherId
  //   else oneUserFriends=result[0].friends+='/'+otherId
  //   const addSql1=`update web_users set friends=? where id=?`
  //   db.query(addSql1,[oneUserFriends,myId],(err,result)=>{
  //     if(err) return res.cc(err)
  //     if(result.affectedRows!==1) return res.cc('添加好友失败')
  //   })
  // })
  // db.query(sql,otherId,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length==0) return res.cc('出现了奇怪的错误')
  //   let otherUserFriends=''
  //   if(!result[0].friends) otherUserFriends=myId
  //   else otherUserFriends=result[0].friends+='/'+myId
  //   const addSql2=`update web_users set friends=? where id=?`
  //   db.query(addSql2,[otherUserFriends,otherId],(err,result)=>{
  //     if(err) return res.cc(err)
  //     if(result.affectedRows!==1) return res.cc('添加好友失败')
  //     res.send({
  //       status:0,
  //       message:'添加好友成功'
  //     })
  //   })
  // })
}

exports.getFriendsInfo=(req,res)=>{
  // const sql=`select friends from web_users where id=?`
  let myId=req.user._doc.username
  const friendslist = []
  Friends.find({$or:[{userid:myId},{friendid:myId}]},(err,result)=>{
    if(err) return res.cc(err)
    result.forEach(item=>{
      if(myId == item.userid) friendslist.push(item.friendid)
      else friendslist.push(item.userid)
    })
    const param = []
    friendslist.forEach(id=>param.push({username:id}))
    User.find({$or:param},(err,result)=>{
      if(err) return res.cc(err)
      result.forEach(item=>item.password='')
      res.send({
        status:0,
        friendsInfoList:result
      })
    })
  })
  
  // db.query(sql,req.user.id,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length==0) return res.cc('出现了奇怪的错误')
  //   let friendsStr=result[0].friends
  //   if(!friendsStr) return res.send({status:0,friendsInfoList:[]})
  //   let friendsList=friendsStr.split('/')
  //   const sqlStr=`select * from web_users where id=?`
  //   let friendsInfoList=[]
  //   friendsList.forEach(function(item){
  //     db.query(sqlStr,item,(err,result)=>{
  //       if(err) return res.cc(err)
  //       if(result.length==0) return res.cc('出现了奇怪的错误')
  //       friendsInfoList.push({...result[0],password:''})
  //     })
  //   })
  //   setTimeout(() => {
  //     res.send({
  //       status:0,
  //       friendsInfoList
  //     })
  //   }, 10);
  // })
}

exports.deleteFriends=(req,res)=>{
  const myId=req.user._doc.username
  const otherId=req.query.otherId
  // const sql=`select friends from web_users where id=?`
  // const sql2=`update web_users set friends=? where id=?`
  Friends.remove({$or:[{userid:myId,friendid:otherId},{userid:otherId,friendid:myId}]},(err,result)=>{
    if(err) return res.cc(err)
    if(result.deletedCount==1){
      res.send({
        status:0,
        message:'删除好友成功'
      })
    }
  })
  // db.query(sql,myId,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length===0) return res.cc('出现了奇怪的错误')
  //   let friendsStr=result[0].friends
  //   if(friendsStr.indexOf('/')==-1) friendsStr=''
  //   else{
  //     if(friendsStr.indexOf(otherId+'/')!=-1) friendsStr= friendsStr.replace(otherId+'/','')
  //     else friendsStr= friendsStr.replace('/'+otherId,'')
  //   }
  //   db.query(sql2,[friendsStr,myId],(err,result)=>{
  //     if(err) return res.cc(err)
  //     if(result.affectedRows!==1) return res.cc('出现了奇怪的错误2')
  //   })
  // })
  // db.query(sql,otherId,(err,result)=>{
  //   if(err) return res.cc(err)
  //   if(result.length===0) return res.cc('出现了奇怪的错误')
  //   let friendsStr=result[0].friends
  //   if(friendsStr.indexOf('/')==-1) friendsStr=''
  //   else{
  //     if(friendsStr.indexOf(myId+'/')!=-1) friendsStr= friendsStr.replace(myId+'/','')
  //     else friendsStr= friendsStr.replace('/'+myId,'')
  //   }
  //   db.query(sql2,[friendsStr,otherId],(err,result)=>{
  //     if(err) return res.cc(err)
  //     if(result.affectedRows!==1) return res.cc('出现了奇怪的错误2')
  //     res.send({
  //       status:0,
  //       message:'删除好友成功'
  //     })
  //   })
  // })
}