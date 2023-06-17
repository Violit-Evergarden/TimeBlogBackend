const mongoose = require('mongoose')
const db = require('../db/index')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id:{type:String},
  username:{type:String},
  password:{type:String},
  email:{type:String},
  nickname:{type:String},
  user_pic:{type:String},
  birthday:{type:String},
  signature:{type:String},
  gender:{type:String},
  friends:{type:String}
})

const FriendsSchema = new Schema({
  userid:{type:String},
  friendid:{type:String}
})

module.exports = db.model('web_users',UserSchema)
module.exports = db.model('friends',FriendsSchema)