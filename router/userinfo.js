const express=require('express')
const router=express.Router()

const router_handler=require('../router_handler/userinfo.js') 

//获取用户信息
router.get('/getuserinfo',router_handler.getUserInfo)
//更新用户信息
router.post('/updateuserinfo',router_handler.updateUserInfo)
//搜索用户
router.get('/searchuser',router_handler.searchUsers)
//添加用户为好友
router.get('/addfriends',router_handler.addFriends)
//获取好友信息
router.get('/getfriendsinfo',router_handler.getFriendsInfo)
//删除好友
router.get('/deletefriends',router_handler.deleteFriends)

module.exports=router