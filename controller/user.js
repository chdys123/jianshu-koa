const User = require("../models/user")
const crud = require("./crudUtil/index")
const jwt = require("jsonwebtoken")


// 用户登录
const login = async (ctx) => {
    let { username, pwd } = ctx.request.body
    console.log("收到了登录请求：",username,pwd)
    await User.findOne({ username, pwd }).then(res => {
        if (res) {
            // 生成token
            let token = jwt.sign({
                username: res.username,
                _id: res._id
            }, "jianshu-server-jwt", {
                expiresIn: 3600 * 24 * 7
            })
            ctx.body = {
                code: 200,
                msg: "登录成功",
                token,
                user:res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "用户名或密码错误",
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "登录时出现异常",
            err
        }
    })
}


// 用户注册
const reg = async (ctx) => {
    let { username, pwd } = ctx.request.body
    let isDouble = false
    await User.findOne({ username }).then(res => {
        if (res) {
            isDouble = true
        }
    })

    if (isDouble) {
        ctx.body = {
            code: 300,
            msg: "用户名已经存在"
        }
        return
    }

    await User.create({ username, pwd }).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: "注册成功"
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "注册失败"
            }
        }

    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "注册出现异常",

        }
    })
}


// 验证用户登录
const verify = async (ctx) => {
    let token = ctx.header.authorization
    token = token.replace("Bearer ", "")
    try {
        let result = jwt.verify(token, "jianshu-server-jwt")
        console.log("result:", result)
        await User.findOne({ _id: result._id }).then(res => {
            if (res) {
                ctx.body = {
                    code: 200,
                    msg: "用户认证成功",
                    user: res
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: "用户认证失败"
                }
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "用户认证失败"
            }
        })
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: "用户认证异常",
            err,
            token
        }
    }
}


// 修改用户密码
const updatePwd = async ctx => {
    let { _id, pwd } = ctx.request.body
    await User.updateOne(
        { _id },
        { pwd }
    ).then(res => {
        if (res.modifiedCount > 0) {
            ctx.body = {
                code: 200,
                msg: "修改成功",
                res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "修改失败",
                res
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "修改密码异常",
            err
        }
    })
}


// 修改用户个人资料
const updatePersonal = async ctx => {
    let user = ctx.request.body
    console.log("修改用户信息：")
    console.log(user)

    await User.updateOne(
        {_id:user._id},
        {
            username:user.username,
            avatar:user.avatar,
            sex:user.sex,
            desc:user.desc,
            phone:user.phone,
            email:user.email
        }
    ).then(res=>{
        if(res.modifiedCount>0){
            ctx.body={
                code:200,
                msg:"修改资料成功",
                res
            }
        }else{
            ctx.body={
                code:300,
                msg:"修改资料失败",
                res
            }
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            msg:"修改资料时出现异常",
            err
        }
    })
}
module.exports = {
    login,
    reg,
    verify,
    updatePwd,
    updatePersonal
}