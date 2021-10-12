
// 增加操作
const add=(model,params,ctx)=>(
    model.create(params).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: "添加成功",
                res
            }
        } else {
            ctx.body = {
                code: 300,
                msg: "添加失败",
                res
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 400,
            msg: "添加时出现异常",
        }
    })
)

// 删除操作
const del=(model,where,ctx)=>(
    model.findOneAndDelete(where).then(rel => {
        ctx.body = {rel}
    }).catch(err => {
        console.log(err)
        ctx.body = {
            code: 400,
            msg: "删除时出现异常",
        }
    })
)

// 修改操作
const update=(model,where,params,ctx)=>(
    model.updateOne(
        where,
        params
    ).then(res => {
        ctx.body = {res}
    }).catch(err => {
        ctx.body = {
            code: 400,
            msg: "修改时出现异常",
        }
    })
)

// 查询操作
const find = (model,where, ctx) => (
    model.find(where).then(result => {
        ctx.body = { result }
    }).catch(err => {
        ctx.body = {
            code:400,
            msg: "查询时候出现异常"
        }
    })
)

// 查询单个
const findOne=(model,where,ctx)=>(
    model.findOne(where).then(res => {
        ctx.body = { res }
    }).catch(err => {
        ctx.body = { err, msg: "查询异常" }
    })
)

module.exports = {
    find,
    findOne,
    add,
    del,
    update
}