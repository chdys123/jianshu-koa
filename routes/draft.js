const {
    add,
    update,
    del,
    find,
    findOne
   
} = require("../controller/draft")

const router = require('koa-router')()
router.prefix("/draft")

// 添加草稿
router.post("/add",add)

// 修改草稿
router.post("/update",update)

// 删除草稿
router.post("/del",del)

// 查询草稿按条件
router.get("/find",find)

// 查询单个草稿
router.get("/findOne",findOne)


module.exports = router