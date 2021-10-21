const mongoose = require("mongoose")


// 文章评论文档对象
const commentSchema = new mongoose.Schema({
    username:String,
    userId:String,
    author:String,
    authorId:String,
    articleTitle:String,
    articleId:String,
    content:String,
    createTime:String,
})
const Comment=mongoose.model("comments",commentSchema)

module.exports=Comment