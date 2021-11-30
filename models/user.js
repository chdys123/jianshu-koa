const mongoose = require("mongoose")



// 系统用户模型对象
const userSchema = new mongoose.Schema({
    username:String,
    pwd:{
        type:String,
        select:false
    },
    avatar:{
        type:String,
        default:""
    },
    sex:{
        type:String,
        default:''
    },
    desc:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    // 关注的人的id
    careId:{
        type:Array,
        default:[]
    },
    // 粉丝
    fans:Array,
    // 粉丝数量
    fansCount:{
        type:Number,
        default:0
    },
    // 收藏的文章id
    collectId:{
        type:Array,
        default:[]
    },

    // 点赞的文章id
    starId:{
        type:Array,
        default:[]
    },








})
const User=mongoose.model("users",userSchema)

module.exports=User
