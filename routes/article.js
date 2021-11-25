const {
    add,
    findAll,
    find,
    findOne,
    update,
    del,
    setStatu,
    userHotArticle,
    hotArticle
} = require("../controller/article")

const router = require('koa-router')()
router.prefix("/article")


// 发布文章
router.post("/add", add)

// 查询所有文章 
router.get("/findAll", findAll)

// 查询文章 按条件
router.get("/find",find)

// 查询单个文章
router.get("/findOne", findOne)

// 修改文章
router.post("/update",update)

// 删除文章
router.post("/del",del)

// 设置文章状态
router.post("/setStatu",setStatu)

// 用户近期最热文章
router.get("/userHotArticle",userHotArticle)

// 头条热榜
router.get("/hotArticle",hotArticle)



module.exports = router
