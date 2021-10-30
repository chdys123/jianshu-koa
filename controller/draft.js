// 草稿
const Draft = require("../models/draft.js")


// 添加草稿
const add = async ctx => {
    let draft = ctx.request.body
    await Draft.create(draft).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: "草稿保存成功",
                res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "草稿保存失败"
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: "保存草稿时出现异常",
            err
        }

    })

}

// 修改草稿
const update = async ctx => {
    let draft = ctx.request.body
    console.log(draft)
    await Draft.updateOne(
        {
            _id: draft._id
        },
        draft.data
    ).then(res=>{
        ctx.body={
            code:200,
            msg:"草稿修改成功"
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            msg:"草稿修改出现异常"
        }
    })
}


// 删除草稿
const del=async ctx=>{
    let _id=ctx.request.body
    await Draft.findOneAndDelete({_id}).then(res => {
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
            msg: "删除草稿出现异常",
            err
        }
    })
}


// 查询草稿
const find=async ctx=>{
    let {authorId}=ctx.query
    await Draft.find({authorId},"title createTime author authorId coverType coverImg").then(res=>{
        // 
        ctx.body={
            code:200,
            msg:"查询草稿成功",
            res
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            msg:"查询草稿出现异常",
            err
        }
    })
}

module.exports = {
    add,
    update,
    del,
    find
}
