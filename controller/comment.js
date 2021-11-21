const Comment = require("../models/comment")
const Article = require("../models/article")

// 添加评论
const add = async ctx => {
    let comment = ctx.request.body
    let isComment = false
    await Comment.create(comment).then(res => {
        if (res) {
            isComment = true
            ctx.body = {
                code: 200,
                msg: "发布成功",
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "评论失败",
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "评论时出现异常",
            err
        }
    })

    if (isComment) {
        await Article.updateOne(
            { _id: comment.articleId },
            { $inc: { comment: 1 } }
        )
    }
}

// 修改评论 也就是 添加回复评论 点赞这种
const update=async ctx=>{
    // 取得哪一个评论要添加评论回复
    let {aId,id,comment}=ctx.request.body
    console.log(id,comment)
    let flag=false
    await Comment.updateOne({_id:id},{$push:{
        forComment:comment
    }}).then(res=>{
        ctx.body={
            code:200,
            msg:"评论成功"
        }
        flag=true
     
    }).catch(err=>{
       ctx.body={
        code:500,
        msg:"评论出现异常"
       }
       flag=false
    })

    // 然后文章评论数目加一
    await Article.updateOne(
        { _id: aId },
        { $inc: { comment: 1 } }
    )
}


// 前台查询评论  通过文章id进行查询  需要分页
const findById = async ctx => {
    let { start, id, size } = ctx.query
    // console.log(start, size,id)
    // if (!size) {
    //     size = "0"
    // } else {
    //     size = Number(size)
    // }
    await Comment.find({ articleId: id }).sort({ "createTime": -1 }).skip(Number(start)).limit(Number(size)).then(res => {
        
        if (res && res.length > 0) {
            ctx.body = {
                code: 200,
                msg: "评论查询成功",
                data: res,
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "没有查询到评论",
                res
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            err,
            msg: "评论查询时出现异常"
        }
    })
}





// 后台评论查询 根据文章作者查询  需要分页
const findByAuthor = async ctx => {
    let { page, authorId, pageSize } = ctx.query

    // 判断页码
    if (!page || isNaN(Number(page))) {
        page = 1
    } else {
        page = Number(page)
    }

    // 每页条数
    if (!pageSize || isNaN(Number(pageSize))) {
        pageSize = 10
    } else {
        pageSize = Number(pageSize)
    }


    // 计算总页数
    let count = 0
    await Comment.find({ authorId }).count().then(res => {
        count = res
    })
    let totolPage = 0
    if (count > 0) {
        totolPage = Math.ceil(count / pageSize)
    }

    // 判断当前页码的范围
    if (totolPage > 0 && page > totolPage) {
        page = totolPage
    } else if (page < 1) {
        page = 1
    }

    // 计算起始位置
    let start = (page - 1) * pageSize

    await Comment.find({ authorId }).skip(start).limit(pageSize).then(res => {
        if (res && res.length > 0) {
            ctx.body = {
                code: 200,
                msg: "评论查询成功",
                res,
                page,
                pageSize,
                count
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "没有查询到评论",
                res
            }
        }

    }).catch(err => {
        ctx.body = {
            code: 500,
            err,
            msg: "评论查询时出现异常"
        }
    })


}




module.exports = {
    add,
    update,
    findById,
    findByAuthor
}