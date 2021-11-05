const Article = require("../models/article")

// 添加文章
const add = async ctx => {

    let article = ctx.request.body
    delete article.id

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

// 按条件查询文章 
const find = async ctx => {
    // console.log(ctx.query)
    let { authorId, t1, t2, key, statu } = ctx.query
    if (!(t1 && t2)) {
        t1 = 0
        t2 = Date.now()
    }
    if (!key) {
        key = ''
    }
    let reg = new RegExp(key, 'i')
    if (statu) {
        await Article.find({ authorId, statu }, { content: 0 }).or([
            { 'title': { $regex: reg } },
            { 'content': { $regex: reg } }
        ]).sort({ "createTime": -1 }).gt('createTime', t1).lt('createTime', t2).then(res => {
            ctx.body = {
                code: 200,
                msg: "查询成功",
                res
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "查询时出现异常",
                err
            }
        })

    } else {
        await Article.find({ authorId }, { content: 0 }).or([
            { 'title': { $regex: reg } },
            { 'content': { $regex: reg } }
        ]).sort({ "createTime": -1 }).gt('createTime', t1).lt('createTime', t2).then(res => {
            ctx.body = {
                code: 200,
                msg: "查询成功",
                res
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "查询时出现异常",
                err
            }
        })

    }


}



// 查询单个文章
const findOne = async ctx => {
    let { id } = ctx.query
    let isRead = false
    await Article.findOne({ _id: id }).then(res => {
        if (res) {
            isRead = true
            ctx.body = {
                code: 200, msg: "查询成功",
                data: res
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
    await Article.updateOne(
        {
            _id: article.id,
            authorId: article.authorId
        },
        article).then(res => {
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
    await Article.findOneAndDelete({ _id: id }).then(res => {
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

// 设置文章状态
const setStatu=async ctx=>{
    let {id,statu}=ctx.request.body
    await Article.updateOne({
        _id:id
    },{
        statu:statu
    }).then(res => {
        if (res.modifiedCount > 0) {
            ctx.body = {
                code: 200,
                msg: "文章修改成功",
                res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "文章修改失败",
                res
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "文章修改时出现异常",
            err
        }
    })
}

module.exports = {
    add,
    findAll,
    find,
    findOne,
    update,
    del,
    setStatu
}