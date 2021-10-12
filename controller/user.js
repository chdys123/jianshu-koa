const { User } = require("../models/index")
const crud = require("./crudUtil/index")

// 添加系统用户
const userAdd = async (ctx) => {
    let {username,pwd}=ctx.request.body
    let params={username,pwd}
    await crud.add(User,params,ctx)
}

// 修改系统用户
const userUpdate = async (ctx) => {
    let {id,username,pwd} = ctx.request.body
    await crud.update(User,{_id:id},{username,pwd},ctx)
}

// 删除用户
const userDel = async (ctx) => {
    let { _id } = ctx.request.body
    await crud.del(User,{_id},ctx)
}

// 查询所有用户
const userFind = async (ctx) => {
   await crud.find(User,null,ctx)
}

// 查询单个
const userFindOne = async (ctx) => {
    await crud.findOne(User,{ _id: ctx.params.id },ctx)
}
module.exports = {
    userAdd,
    userUpdate,
    userDel,
    userFind,
    userFindOne
}