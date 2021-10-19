const mongoose = require("mongoose")

// 文章模型对象
const articleSchema = new mongoose.Schema({
    id:Number,
    title:String,
    createTime:String,
    // 文章内容
    content:String,
    // 文章来源
    stemfrom:String,
    // 阅读量
    read:{
        type:Number,
        default:0
    },
    // 点赞数量
    star:{
        type:Number,
        default:0
    },
    // 评论数量
    comment:{
        type:Number,
        default:0
    },

    // 作者
    author:String



   

})
const Article=mongoose.model("articles",articleSchema)

module.exports=Article