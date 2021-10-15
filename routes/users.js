const router = require('koa-router')()
const userCtl = require("../controller/user")

// router.prefix("/user")



// 用户登录
router.post("/login",userCtl.login)

// 用户注册
router.post("/reg",userCtl.reg)

// 验证用户登录
router.post("/verify",userCtl.verify)

// 修改密码
router.post("/update/pwd",userCtl.updatePwd)

module.exports = router

