const router = require('koa-router')()
const userCtl = require("../controller/user")
router.prefix('/users')

// 添加系统用户
router.post("/add",userCtl.userAdd)
// 修改系统用户
router.post("/update",userCtl.userUpdate)
// 删除系统用户
router.post("/del",userCtl.userDel)
// 查找所有系统用户
router.get("/find",userCtl.userFind)
// 查找单个系统用户
router.get("/find/:id",userCtl.userFindOne)




// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

module.exports = router
