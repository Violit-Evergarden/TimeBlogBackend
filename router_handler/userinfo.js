//导入数据库操作模块
const db = require('../db/index')


exports.getUserInfo=(req,res)=>{
  const sql=`select * from web_users where id=?`
  db.query(sql,req.user.id,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length!==1) return res.cc('获取用户信息失败')
    res.send({
      status:0,
      message:'获取用户信息成功',
      data:{...result[0],password:''}
    })
  })
}
exports.updateUserInfo=(req,res)=>{
  const sql= `update web_users set? where id=?`
  const userinfo=req.body
  db.query(sql,[userinfo,userinfo.id],(err,result)=>{
    if(err) return res.cc(err)
    if(result.affectedRows!==1) return res.cc('更新用户信息失败')
    res.send({
      status:0,
      message:'更新用户信息成功'
    })
  })
}

exports.searchUsers=(req,res)=>{
  const sql=`select * from web_users where username=?`
  db.query(sql,req.query.username,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('没有此用户',2)
    res.send({
      status:0,
      message:'搜索到对应用户',
      data:{
        id:result[0].id,
        username:result[0].username,
        nickname:result[0].nickname,
        user_pic:result[0].user_pic,
        signature:result[0].signature
      }
    })
  })
}

exports.addFriends=(req,res)=>{
  let myId=req.user.id
  let otherId=req.query.otherId
  const sql=`select friends from web_users where id=?`
  db.query(sql,myId,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('出现了奇怪的错误')
    let oneUserFriends=''
    if(!result[0].friends) oneUserFriends=otherId
    else oneUserFriends=result[0].friends+='/'+otherId
    const addSql1=`update web_users set friends=? where id=?`
    db.query(addSql1,[oneUserFriends,myId],(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('添加好友失败')
    })
  })
  db.query(sql,otherId,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('出现了奇怪的错误')
    let otherUserFriends=''
    if(!result[0].friends) otherUserFriends=myId
    else otherUserFriends=result[0].friends+='/'+myId
    const addSql2=`update web_users set friends=? where id=?`
    db.query(addSql2,[otherUserFriends,otherId],(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('添加好友失败')
      res.send({
        status:0,
        message:'添加好友成功'
      })
    })
  })
}

exports.getFriendsInfo=(req,res)=>{
  const sql=`select friends from web_users where id=?`
  db.query(sql,req.user.id,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('出现了奇怪的错误')
    let friendsStr=result[0].friends
    if(!friendsStr) return res.send({status:0,friendsInfoList:[]})
    let friendsList=friendsStr.split('/')
    const sqlStr=`select * from web_users where id=?`
    let friendsInfoList=[]
    friendsList.forEach(function(item){
      db.query(sqlStr,item,(err,result)=>{
        if(err) return res.cc(err)
        if(result.length==0) return res.cc('出现了奇怪的错误')
        friendsInfoList.push({...result[0],password:''})
      })
    })
    setTimeout(() => {
      res.send({
        status:0,
        friendsInfoList
      })
    }, 10);
  })
}

exports.deleteFriends=(req,res)=>{
  const myId=req.user.id
  const otherId=req.query.otherId
  const sql=`select friends from web_users where id=?`
  const sql2=`update web_users set friends=? where id=?`
  db.query(sql,myId,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length===0) return res.cc('出现了奇怪的错误')
    let friendsStr=result[0].friends
    if(friendsStr.indexOf('/')==-1) friendsStr=''
    else{
      if(friendsStr.indexOf(otherId+'/')!=-1) friendsStr= friendsStr.replace(otherId+'/','')
      else friendsStr= friendsStr.replace('/'+otherId,'')
    }
    db.query(sql2,[friendsStr,myId],(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('出现了奇怪的错误2')
    })
  })
  db.query(sql,otherId,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length===0) return res.cc('出现了奇怪的错误')
    let friendsStr=result[0].friends
    if(friendsStr.indexOf('/')==-1) friendsStr=''
    else{
      if(friendsStr.indexOf(myId+'/')!=-1) friendsStr= friendsStr.replace(myId+'/','')
      else friendsStr= friendsStr.replace('/'+myId,'')
    }
    db.query(sql2,[friendsStr,otherId],(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('出现了奇怪的错误2')
      res.send({
        status:0,
        message:'删除好友成功'
      })
    })
  })
}