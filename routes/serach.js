const router = require('koa-router')()
const User = require("../models/user")
const Article = require("../models/article")
router.prefix("/serach")




// 输入框输入关键字的时候 返回的数据 有作者和文章信息
router.get("/artAndAuth", async ctx => {
    let { key } = ctx.query
    let reg = new RegExp(key, 'i')
    let article = null
    await Article.find({ statu: '已发布' }, { content: 0 }).or([
        { 'title': { $regex: reg } },
        { 'content': { $regex: reg } }
    ]).sort({ "read": -1 }).skip(0).limit(4).then(res => {
        article = res
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "出现异常"
        }
    })

    await User.find(null, "_id username avatar").or([
        { 'username': { $regex: reg } }
    ]).sort({ "fansCount": -1 }).skip(0).limit(4).then(res => {
        ctx.body = {
            code: 200,
            authod: res,
            article: article
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "出现异常"
        }
    })
})


// 进入搜索页面 分页查询 文章的数据
router.get("/article", async ctx => {
    let { start, size, key } = ctx.query
    let reg = new RegExp(key, 'i')

    // 查询总数
    let count=0
    await Article.find({ statu: '已发布' }, { content: 0 }).or([
        { 'title': { $regex: reg } },
        { 'content': { $regex: reg } }
    ]).count().then(res=>{
        count=res
    })

    await Article.find({ statu: '已发布' }, { content: 0 }).or([
        { 'title': { $regex: reg } },
        { 'content': { $regex: reg } }
    ]).sort({ "read": -1 }).skip(Number(start)).limit(Number(size)).then(res => {
        ctx.body = {
            code: 200,
            msg: "查询成功",
            data: res,
            count,
        }

    }).catch(err => {
        ctx.body = {
            code: 200,
            msg: "查询异常",
            data: err
        }
    })

})


// 进入搜索页面分页查询 作者的数据
router.get("/author", async ctx => {
    let { start, size, key } = ctx.query
    let reg = new RegExp(key, 'i')

    // 查询总数
    let count=0
    await User.find().or([
        { 'username': { $regex: reg } },
    ]).count().then(res=>{
        count=res
    })

    await User.find(null,"_id username desc fansCount avatar").or([
        { 'username': { $regex: reg } },
    ]).sort({ "fansCount": -1 }).skip(Number(start)).limit(Number(size)).then(res => {
        ctx.body = {
            code: 200,
            msg: "查询成功",
            data: res,
            count:count
        }
    }).catch(err => {
        ctx.body = {
            code: 200,
            msg: "查询异常",
            data: err
        }
    })
})


module.exports = router
