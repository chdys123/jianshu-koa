const Article = require("../models/article")

// 添加文章
const add = async ctx => {
    let article = ctx.request.body
    await Article.create(article).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: "文章发布成功"
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "文章发布失败"
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "发布文章时出现异常",
            err
        }
    })

}

// 查询所有文章分页
const findAll = async ctx => {
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
    await Article.find({ authorId }).count().then(res => {
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

    await Article.find({ authorId }).skip(start).limit(pageSize).then(res => {
        if (res && res.length > 0) {
            ctx.body = {
                code: 200,
                msg: "文章查询成功",
                res,
                page,
                pageSize,
                count
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "没有查询到文章",
                res
            }
        }

    }).catch(err => {
        ctx.body = {
            code: 500,
            err,
            msg: "文章查询时出现异常"
        }
    })


}

// 查询单个文章
const findOne = async ctx => {
    let { id } = ctx.query
    let isRead = false
    await Article.findOne({ id }).then(res => {
        if (res) {
            isRead = true
            ctx.body = {
                code: 200, msg: "查询成功",
                res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "文章查询失败"
            }
        }

    }).catch(err => {
        ctx.body = {
            code: 500,
            err,
            msg: "文章查询时出现异常"
        }
    })


    if (isRead) {
        // 阅读数自增
        await Article.updateOne({ id }, { $inc: { read: 1 } })
    }


}

// 修改文章   需要获取当前jwt的用户id和 authorId比较
const update = async ctx => {
    let article = ctx.request.body
    console.log(article)
    await Article.updateOne(
        {
            id: article.id,
            authorId: article.authorId
        },
        {
            title: article.title,
            stemfrom: article.stemfrom,
            content: article.content
        }).then(res => {
            if (res.modifiedCount > 0) {
                ctx.body = {
                    code: 200,
                    msg: "文章更新成功",
                    res
                }
            } else {
                ctx.body = {
                    code: 300,
                    msg: "文章更新失败",
                    res
                }
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "文章更新时出现异常",
                err
            }
        })

}

// 删除文章
const del = async ctx => {
    let { id } = ctx.request.body
    await Article.findOneAndDelete({ id: id }).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: "删除成功"
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "删除失败"
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "删除文章出现异常",
            err
        }
    })

}

module.exports = {
    add,
    findAll,
    findOne,
    update,
    del
}