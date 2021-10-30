// 草稿对象
const mongoose = require("mongoose")

// 文章模型对象
const draftSchema = new mongoose.Schema({
    
    title:String,
    createTime:String,
    // 文章内容
    content:String,
    // 作者
    author:String,
    // 作者_id
    authorId:String,
    // 封面类型
    coverType:String,
    // 封面图片
    coverImg:Array,
   
})
const Draft=mongoose.model("draft",draftSchema)

module.exports=Draft