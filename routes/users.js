const router = require('koa-router')()
const userCtl = require("../controller/user")

// router.prefix("/user")



// 用户登录
router.post("/login", userCtl.login)

// 用户注册
router.post("/reg", userCtl.reg)

// 验证用户登录
router.post("/verify", userCtl.verify)

// 修改密码
router.post("/update/pwd", userCtl.updatePwd)

// 修改用户资料
router.post("/update/personal", userCtl.updatePersonal)

// 查询用户信息
router.get("/user/getmsg", userCtl.getMsg)

// 判断某篇文章是否被用户收藏
router.get("/user/isCollect", userCtl.isCollect)

// 收藏或者取消收藏某篇文章
router.get("/user/collect",userCtl.collect)

// 判断某篇文章是否被用户点赞
router.get("/user/isStar", userCtl.isStar)

// 收藏或者取消收藏某篇文章
router.get("/user/star", userCtl.star)

// 获取用户收藏的文章
router.get("/user/getCollect",userCtl.getCollect)


// 获取用户是否关注作者
router.get("/user/isCare",userCtl.isCare)

// 关注或者取消关注
router.get("/user/care",userCtl.care)

module.exports = router

