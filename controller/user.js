const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")
const Draft=require("../models/draft")
const jwt = require("jsonwebtoken")


// 用户登录
const login = async (ctx) => {
    let { username, pwd } = ctx.request.body
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
                user: res
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
            code: 400,
            msg: "用户名已经存在"
        }
        return
    }
    let avatar = "http://localhost:3000/images/avatar.png"

    await User.create({ username, pwd, avatar }).then(res => {
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
    console.log("token:")
    console.log(token)
    try {
        let result = jwt.verify(token, "jianshu-server-jwt")
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
    let flag = false
    await User.updateOne(
        { _id: user._id },
        {
            username: user.username,
            avatar: user.avatar,
            sex: user.sex,
            desc: user.desc,
            phone: user.phone,
            email: user.email
        }
    ).then(res => {
        if (res.modifiedCount > 0) {
            flag = true

        } else {
            ctx.body = {
                code: 300,
                msg: "修改资料失败",
                res
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "修改资料时出现异常",
            err
        }
    })

    if (flag) {
        // 修改一级评论的头像 和姓名

        await Comment.updateMany({ userId: user._id }, { username: user.username, avatar: user.avatar }).then(res => {
            
          
        }).catch(err => {
        })

        // 修改文章的姓名
        await Article.updateMany({ authorId: user._id }, { author: user.username }).then(res => {
          
        }).catch(err => {
        })
        // 修改草稿的姓名
        await Draft.updateMany({ authorId: user._id }, { author: user.username }).then(res => {
          
        }).catch(err => {
        })

        ctx.body = {
            code: 200,
            msg: "修改资料成功",
        }


    }
}

// 获取用户信息 根据用户id
const getMsg = async ctx => {
    let { id } = ctx.query
    let data = {}
    await User.findOne({ _id: id }).then(res => {
        data = res
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "查询时出现异常",
            data: err
        }
    })
    // 查询获赞量
    await Article.find({ authorId: id }, 'star').then(res => {
        let star = res.reduce((result, item) => {
            return result + Number(item.star)
        }, 0)
        let a = { ...data._doc }
        // a.fans = a.fans.length
        // a.careId = a.careId.length
        a.star = star
        a.fans = a.fans.length
        a.careId = a.careId.length
        ctx.body = {
            data: a,
            code: 200,
            msg: "查询成功"
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            data: err,
            msg: "查询时出现异常",
        }
    })


}

// 是否收藏某篇文章
const isCollect = async ctx => {
    let { userId, articleId } = ctx.query
    await User.findOne({ _id: userId }, 'collectId').then(res => {
        let flag = res.collectId.includes(articleId)
        ctx.body = {
            code: 200,
            msg: "查询成功",
            data: flag
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "服务器出现异常",
            err
        }
    })
}

// 收藏某篇文章或取消收藏
const collect = async ctx => {
    let { userId, articleId, cate } = ctx.query
    let arr = []
    // 先查出用户的收藏文章 然后修改收藏文章id之后  修改数据库
    await User.findOne({ _id: userId }, 'collectId').then(res => {
        arr = res.collectId
    })
    // 如果收藏
    if (cate == 1) {
        arr.push(articleId)
        await User.updateOne({ _id: userId }, { collectId: arr }).then(res => {
            ctx.body = {
                code: 200,
                data: true,
                msg: "收藏成功"
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                data: false,
                msg: "收藏出现异常"
            }
        })
    } else {
        // 取消收藏
        let index = arr.findIndex(item => {
            return item == articleId
        })
        arr.splice(index, 1)
        await User.updateOne({ _id: userId }, { collectId: arr }).then(res => {
            ctx.body = {
                code: 200,
                data: false,
                msg: "取消收藏成功"
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                data: true,
                msg: "取消收藏出现异常"
            }
        })
    }
}

// 是否点赞某篇文章
const isStar = async ctx => {
    let { userId, articleId } = ctx.query
    await User.findOne({ _id: userId }, 'starId').then(res => {
        let flag = res.starId.includes(articleId)
        ctx.body = {
            code: 200,
            msg: "查询成功",
            data: flag
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "服务器出现异常",
            err
        }
    })
}


// 点赞某篇文章或取消点赞
const star = async ctx => {
    let { userId, articleId, cate } = ctx.query
    let arr = []
    // 先查出用户的点赞文章 然后修改点赞文章id之后  修改数据库
    await User.findOne({ _id: userId }, 'starId').then(res => {
        arr = res.starId
    })
    let flag = null
    // 如果点赞
    if (cate == 1) {
        arr.push(articleId)
        await User.updateOne({ _id: userId }, { starId: arr }).then(res => {

            // 文章的点赞数量加一
            flag = true

            ctx.body = {
                code: 200,
                data: true,
                msg: "点赞成功"
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                data: false,
                msg: "点赞出现异常"
            }
        })
    } else {
        // 取消点赞
        let index = arr.findIndex(item => {
            return item == articleId
        })
        arr.splice(index, 1)
        await User.updateOne({ _id: userId }, { starId: arr }).then(res => {
            // 文章的点赞数量减一
            flag = false

            ctx.body = {
                code: 200,
                data: false,
                msg: "取消点赞成功"
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                data: true,
                msg: "取消点赞出现异常"
            }
        })
    }
    if (flag) {
        await Article.updateOne({ _id: articleId }, { $inc: { star: 1 } })
    }
    if (!flag) {
        await Article.updateOne({ _id: articleId }, { $inc: { star: -1 } })
    }
}


// 获取用户收藏的文章
const getCollect = async ctx => {
    let { userId } = ctx.query
    let arr = []
    await User.findOne({ _id: userId }, 'collectId').then(res => {
        arr = res.collectId
    })

    await Article.find({ _id: { $in: arr } }, { content: 0 }).then(res => {
        ctx.body = {
            code: 200,
            msg: "查询成功",
            res
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "查询出现异常",
            err
        }
    })
}

// 获取用户是否关注某个作者
const isCare = async ctx => {
    let { userId, authorId } = ctx.query
    let arr = [], data
    await User.findOne({ _id: userId }, 'careId').then(res => {
        arr = res.careId

    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "查询时出现异常",
            data: err
        }
    })
    if (arr.includes(authorId)) {
        data = true
    } else {
        data = false
    }
    ctx.body = {
        code: 200,
        msg: "查询成功",
        data
    }
}



// 用户关注或者取消关注某个作者
const care = async ctx => {
    let { userId, authorId, cate } = ctx.query

    let arr = [], arr2 = []
    // 先查出用户的关注的人 然后修改关注id之后  修改数据库
    await User.findOne({ _id: userId }, 'careId').then(res => {
        arr = res.careId
    })
    // 查询出作者的粉丝 修改粉丝数组
    await User.findOne({ _id: authorId }, 'fans').then(res => {
        arr2 = res.fans
    })
    let data = null
    if (cate == 1) {
        // 关注
        arr.push(authorId)
        arr2.push({
            id: userId,
            time: Date.now()
        })
        data = true

    } else {
        // 取消关注
        let index = arr.findIndex(item => item == authorId)
        let index2 = arr2.findIndex(item => item.id == userId)
        arr.splice(index, 1)
        arr2.splice(index2, 1)
        data = false
    }
    let flag = null
    await User.updateOne({ _id: userId }, { careId: arr }).then(res => {
        flag = true
        ctx.body = {
            code: 200,
            msg: "成功",
            data
        }
    }).catch(err => {
        flag = false
        ctx.body = {
            code: 500,
            msg: "出现异常"
        }
    })
    if (flag) {
        if (cate == 1) {
            await User.updateOne({ _id: authorId }, { fans: arr2, $inc: { fansCount: 1 } }).then(res => { }).catch(err => { })
        } else {
            await User.updateOne({ _id: authorId }, { fans: arr2, $inc: { fansCount: -1 } }).then(res => { }).catch(err => { })
        }
    }

}


// 查询用户的粉丝列表 可能需要分页 前端用懒加载
const getFans = async ctx => {
    let { userId, authorId } = ctx.query
    let fans = []
    await User.findOne({ _id: authorId }, "fans").then(res => {
        fans = res.fans

    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "查询出现异常",
            data: err
        }
        return
    })
    // 挨个查询这些粉丝的姓名 头像 服了 我靠 咋就不能populate呢
    let result = []
    for (let i = 0; i < fans.length; i++) {
        await User.findOne({ _id: fans[i].id }, "username avatar fansCount").then(res => {
            let obj = {
                id: fans[i].id,
                username: res.username,
                avatar: res.avatar,
                fansCount: res.fansCount
            }
            result.push(obj)
        })
    }
    await User.findOne({ _id: userId }, "careId").then(res => {
        result.forEach((item, index) => {
            if (res.careId.includes(item.id)) {
                result[index].isCare = true
            } else {
                result[index].isCare = false
            }
        })
    })
    ctx.body = {
        code: 200,
        msg: "查询成功",
        data: result,
    }
}





// 查询用户的关注列表 可能需要分页 前端用懒加载
const getCare = async ctx => {
    let { userId, authorId } = ctx.query
    let careId = []
    await User.findOne({ _id: authorId }, "careId").then(res => {
        careId = res.careId

    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "查询出现异常",
            data: err
        }
        return
    })

    // 挨个查询这些关注的姓名 头像 服了 我靠 咋就不能populate呢
    let result = []
    for (let i = 0; i < careId.length; i++) {
        await User.findOne({ _id: careId[i] }, "username avatar fansCount").then(res => {
            let obj = {
                id: careId[i],
                username: res.username,
                avatar: res.avatar,
                fansCount: res.fansCount
            }
            result.push(obj)
        })
    }
    await User.findOne({ _id: userId }, "careId").then(res => {
        result.forEach((item, index) => {
            if (res.careId.includes(item.id)) {
                result[index].isCare = true
            } else {
                result[index].isCare = false
            }
        })
    })
    ctx.body = {
        code: 200,
        msg: "查询成功",
        data: result,
    }
}





// 根据用户 和 时间 获取今日粉丝变化数 和粉丝总数
const getFansData = async ctx => {
    let { userId, t1, t2 } = ctx.query
    // 如果没有传时间 就是 返回今日变化数 和粉丝总数
    if (!t1 && !t2) {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        let time = Date.parse(new Date(year, month, day, 0, 0, 0, 0))
        await User.findOne({ _id: userId }, 'fans').then(res => {
            let fansCount = res.fans.length
            let fanszt = 0
            res.fans.forEach(item => {
                if (item.time <= time) {
                    fanszt++
                }
            })
            ctx.body = {
                code: 200,
                msg: "查询成功",
                data: {
                    data1: fansCount - fanszt,
                    data2: fansCount
                }
            }
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "查询时出现异常",
                data: err
            }
        })
        return
    } else {
        // 如果上传了时间范围
        let result = []
        let fans = []
        await User.findOne({ _id: userId }).then(res => {
            fans = res.fans
        }).catch(err => {
            ctx.body = {
                code: 500,
                msg: "查询时出现异常",
                data: err
            }
        })

        let len = (t2 - t1) / (1000 * 60 * 60 * 24) + 1

        t2 = Number(t2) + 1000 * 60 * 60 * 24
        for (let i = 0; i < len; i++) {
            let a = 0
            let b = 0
            fans.forEach(item => {
                // 总数
                if (item.time < (t2 - i * 1000 * 60 * 60 * 24)) {
                    a++
                }
                if (item.time < (t2 - (i + 1) * 1000 * 60 * 60 * 24)) {
                    b++
                }

            })
            result.push({ a: a, b: a - b })
        }
        ctx.body = {
            code: 200,
            msg: "查询成功",
            data: result.reverse()
        }
    }
}




module.exports = {
    login,
    reg,
    verify,
    updatePwd,
    updatePersonal,
    getMsg,
    isCollect,
    collect,
    isStar,
    star,
    getCollect,
    isCare,
    care,
    getFans,
    getCare,
    getFansData

}