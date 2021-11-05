const mongoose = require("mongoose")

// 文章模型对象
const articleSchema = new mongoose.Schema({
    
    title:String,
    createTime:String,
    // 文章内容
    content:String,
 
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
    author:String,
    // 作者_id
    authorId:String,
    // 封面类型
    coverType:String,
    // 封面图片
    coverImg:Array,
    // 文章状态  审核中  未通过 已发布 仅我可见
    statu:String,
  
})
const Article=mongoose.model("articles",articleSchema)

module.exports=Article