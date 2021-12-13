const mongoose = require("mongoose")


// 文章评论文档对象
const commentSchema = new mongoose.Schema({
    // 评论人
    username: String,
    // 评论人id
    userId: String,
    // 评论人头像
    avatar: String,
    // 文章作者
    author: String,
    // 文章作者id
    authorId: String,
    // 文章标题
    articleTitle: String,
    // 文章Id
    articleId: String,
    // 评论内容
    content: String,
    // 评论时间
    createTime: String,
    // 评论点赞数
    star: {
        type: Number,
        default: 0
    },
    // 点赞的人的Id
    starUserId: {
        type: Array,
        default: []
    },
    // 回复的信息
    forComment:
        [{
            // 回复的userId
            userId: String,
            // 回复username
            username: String,
            // 回复的头像
            avatar: String,
            // 回复的内容
            content: String,
            // 回复的时间
            createTime: String,
            // 被回复的人id
            BcId: String,
            // 被回复的人的姓名,
            BcName: String,
            // 被回复人头像
            BcAvatar: String,
            // 被回复的内容
            BcContent: String
        }]
})



const Comment = mongoose.model("comments", commentSchema)

module.exports = Comment