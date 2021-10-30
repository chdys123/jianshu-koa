const {
    add,
    update,
    del,
    find
   
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


module.exports = router